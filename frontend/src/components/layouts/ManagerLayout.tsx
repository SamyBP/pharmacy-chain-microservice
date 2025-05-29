import { useHandler } from "@/hooks/use-handler";
import { pharmacyService } from "@/services/pharmacy-service";
import { medicationService } from "@/services/medication-service";
import { csvFileService, docxFileService } from "@/services/file-service";
import type { MostSoldMedicationDto, RegisterInventoryRequest, SaleTrendDto, CreateMedicationRequest } from "@/types/dtos";
import { ActionButton } from "@/components/common/ActionButton";
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography, MenuItem } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ManagerHeader } from "../header/ManagerHeader";
import { useAuth } from "@/hooks/use-auth";
import { useNotifier } from "@/hooks/use-notifier";
import { useNavigate } from "react-router-dom";
import { usePharmacies } from "@/hooks/use-pharmacies";
import { useMedication } from "@/hooks/use-medication";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';

export default function ManagerLayout() {
	const [isLoading, setIsLoading] = useState(true);
	const [mostSoldMedications, setMostSoldMedications] = useState<MostSoldMedicationDto[]>([]);
	const [saleTrends, setSaleTrends] = useState<SaleTrendDto[]>([]);
	const { withErrorHandling } = useHandler();
	const { notifier } = useNotifier()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { pharmacies } = usePharmacies()
	const { medications, manufacturers, addMedication } = useMedication()

	if (!user) {
		notifier.warning("You are not authorized here")
		navigate("/")
		return
	}

	useEffect(() => {
		withErrorHandling(async () => {
			setIsLoading(true);
			const [medications, trends] = await Promise.all([
				pharmacyService.getMostSoldMedcations(),
				pharmacyService.getSaleTrends()
			]);

			setMostSoldMedications(medications);
			setSaleTrends(trends);
			setIsLoading(false);
		});
	}, []);

	// Prepare data for most sold medications chart
	const medicationChartData = mostSoldMedications.map(med => ({
		name: med.name,
		quantity: med.quantity
	}));

	// Prepare data for sale trends chart
	const trendChartData = saleTrends.map(trend => ({
		date: new Date(trend.sale_date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		}),
		amount: trend.total_sales_amount
	}));

	// Prepare data for manufacturers chart
	const manufacturerData = mostSoldMedications.reduce((acc, med) => {
		const manufacturer = med.manufacturer.name;
		acc[manufacturer] = (acc[manufacturer] || 0) + med.quantity;
		return acc;
	}, {} as Record<string, number>);

	const manufacturerChartData = Object.entries(manufacturerData).map(([name, quantity]) => ({
		name,
		quantity
	}));

	const LoadingState = () => (
		<Box
			sx={{
				height: 300,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<CircularProgress />
		</Box>
	);

	const [selectedPharmacy, setSelectedPharmacy] = useState<number>(user.pharmacies[0] || 0)
	const [registerForm, setRegisterForm] = useState<RegisterInventoryRequest>({
		medication_id: 0,
		quantity: 0,
		expiration_date: ''
	});

	const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegisterForm(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleDateChange = (date: Date | null) => {
		if (date) {
			setRegisterForm(prev => ({
				...prev,
				expiration_date: date.toISOString()
			}));
		}
	};

	const handleRegisterSubmit = () => {
		withErrorHandling(async () => {
			await pharmacyService.registerMedicationInPharmacyInventory(
				selectedPharmacy,
				registerForm
			);
			notifier.success("Successfully registered medication in inventory");
			setSelectedPharmacy(user.pharmacies[0])
			setRegisterForm({
				medication_id: 0,
				quantity: 0,
				expiration_date: ''
			});
		});
	};

	const [createForm, setCreateForm] = useState<CreateMedicationRequest>({
		name: '',
		description: '',
		purchase_price: 0,
		manufacturer_id: 0
	});
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCreateForm(prev => ({
			...prev,
			[name]: name === 'purchase_price'
				? parseFloat(value) || 0
				: name === 'manufacturer_id'
					? parseInt(value)
					: value
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(e.target.files || []);
		const totalFiles = [...selectedFiles, ...newFiles];

		if (totalFiles.length > 3) {
			notifier.error("Maximum 3 images allowed");
			return;
		}

		setSelectedFiles(totalFiles);
	};

	const handleCreateSubmit = () => {
		if (selectedFiles.length === 0) {
			notifier.error("At least one image is required");
			return;
		}

		withErrorHandling(async () => {
			const medication = await medicationService.createMedication(createForm, selectedFiles);
			notifier.success("Successfully created medication");
			addMedication(medication)
			setCreateForm({
				name: '',
				description: '',
				purchase_price: 0,
				manufacturer_id: 0
			});
			setSelectedFiles([]);
		});
	};


	const handleExport = (type: 'CSV' | 'DOCX') => {
		const exportData = saleTrends.map(sale => ({
			date: sale.sale_date,
			quantity: sale.number_of_sales,
			revenue: sale.total_sales_amount
		}));

		const filename = 'sale-trends-past-7-days'

		if (type === 'DOCX') {
			docxFileService.export(exportData, filename)
		} else {
			csvFileService.export(exportData, filename)
		}

	}

	return (
		<>
			<Box
				sx={{
					minHeight: '90vh',
					width: '100vw',
					backgroundImage: "linear-gradient(54deg,rgba(39, 44, 48, 1) 63%, rgba(94, 89, 97, 1) 99%);",
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						inset: 0,
						backgroundColor: 'rgba(0,0,0,0.3)',
						zIndex: 1,
					},
				}}
			>
				<ManagerHeader />

				{isLoading ? (
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
							zIndex: 2,
						}}
					>
						<CircularProgress size={60} sx={{ color: 'primary.light' }} />
					</Box>
				) : (
					<Container
						maxWidth="xl"
						sx={{
							position: 'relative',
							zIndex: 2,
							mt: 15,
							display: 'flex',
							gap: 3,
							flexWrap: { xs: 'wrap', lg: 'nowrap' }
						}}
					>
						{/* Most Sold Medications Chart */}
						<Paper
							elevation={8}
							sx={{
								p: 3,
								flex: 1,
								minWidth: { xs: '100%', lg: '30%' },
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: 3
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
								Most Sold Medications
							</Typography>
							{isLoading ? <LoadingState /> : (
								<Box sx={{ width: '100%', height: 300 }}>
									<ResponsiveContainer>
										<BarChart data={medicationChartData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar
												dataKey="quantity"
												fill="#36454F"
												name="Quantity Sold"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</Box>
							)}
						</Paper>

						{/* Sale Trends Chart */}
						<Paper
							elevation={8}
							sx={{
								p: 3,
								flex: 1,
								minWidth: { xs: '100%', lg: '30%' },
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: 3
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
								Sale Trends
							</Typography>
							{isLoading ? <LoadingState /> : (
								<Box sx={{ width: '100%', height: 300 }}>
									<ResponsiveContainer>
										<LineChart data={trendChartData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis
												domain={() => {
													if (!trendChartData?.length) return [0, 1000];
													const values = trendChartData.map((d) => Number(d.amount)).filter((v) => !isNaN(v));
													if (!values.length) return [0, 1000];

													const min = Math.min(...values);
													const max = Math.max(...values);
													return [min - 100, max + 100];
												}}
												tick={{ fontSize: 12 }}
												tickFormatter={(value) => `$${value.toLocaleString()}`}
											/>
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="amount"
												stroke="#36454F"
												name="Sales Amount"
												dot={{ r: 4 }}
												strokeWidth={2} // Slightly thicker line for better visibility
											/>
										</LineChart>
									</ResponsiveContainer>
								</Box>
							)}
						</Paper>

						{/* Top Manufacturers Chart */}
						<Paper
							elevation={8}
							sx={{
								p: 3,
								flex: 1,
								minWidth: { xs: '100%', lg: '30%' },
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: 3
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
								Top Manufacturers
							</Typography>
							{isLoading ? <LoadingState /> : (
								<Box sx={{ width: '100%', height: 300 }}>
									<ResponsiveContainer>
										<BarChart data={manufacturerChartData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar
												dataKey="quantity"
												fill="#36454F"
												name="Total Units Sold"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</Box>
							)}
						</Paper>
					</Container>
				)}

				{isLoading ? (<></>) : (
					<Box
						id="inventory"
						sx={{
							mt: 8,
							py: 6,
							backgroundColor: '#f5f5f5',
							position: 'relative',
							zIndex: 2
						}}
					>
						<Container maxWidth="sm">
							<Typography
								variant="h5"
								gutterBottom
								fontWeight={600}
								textAlign="center"
								color="primary"
								mb={4}
							>
								Register Medication in Inventory
							</Typography>
							<Paper
								elevation={3}
								sx={{
									p: 4,
									borderRadius: 2,
									backgroundColor: 'white'
								}}
							>
								<Box
									component="form"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: 3
									}}
								>
									<TextField
										select
										fullWidth
										label="Pharmacy"
										name="pharmacy_id"
										value={selectedPharmacy}
										onChange={(e) => setSelectedPharmacy(Number(e.target.value))}
										required
									>
										{user?.pharmacies.map(pharmacyId => {
											const pharmacy = pharmacies.find(p => p.id === pharmacyId);
											return pharmacy ? (
												<MenuItem key={pharmacy.id} value={pharmacy.id}>
													{pharmacy.name}
												</MenuItem>
											) : null;
										})}
									</TextField>

									<TextField
										select
										fullWidth
										label="Medication"
										name="medication_id"
										value={registerForm.medication_id}
										onChange={handleRegisterChange}
										required
									>
										{medications.map(medication => (
											<MenuItem key={medication.id} value={medication.id}>
												{medication.name}
											</MenuItem>
										))}
									</TextField>

									<TextField
										fullWidth
										label="Quantity"
										name="quantity"
										type="number"
										value={registerForm.quantity}
										onChange={handleRegisterChange}
										required
										inputProps={{ min: 1 }}
									/>

									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											label="Expiration Date"
											value={registerForm.expiration_date ? new Date(registerForm.expiration_date) : null}
											onChange={handleDateChange}
											slotProps={{
												textField: {
													fullWidth: true,
													required: true
												}
											}}
											disablePast
										/>
									</LocalizationProvider>

									<ActionButton
										variant="contained"
										fullWidth
										onClick={handleRegisterSubmit}
										sx={{
											mt: 2,
											height: '48px',
											fontSize: '16px'
										}}
									>
										Register Medication
									</ActionButton>
								</Box>
							</Paper>
						</Container>
					</Box>
				)}

				{/* Create Medication Section */}
				{isLoading ? (<></>) : (
					<Box
						id="create-medication"
						sx={{
							py: 6,
							position: 'relative',
							zIndex: 2
						}}
					>
						<Container maxWidth="sm">
							<Typography
								variant="h5"
								gutterBottom
								fontWeight={600}
								textAlign="center"
								color="primary.light"
								mb={4}
							>
								Add a new medication type
							</Typography>
							<Paper
								elevation={3}
								sx={{
									p: 4,
									borderRadius: 2,
									backgroundColor: 'white'
								}}
							>
								<Box
									component="form"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: 3
									}}
								>
									<TextField
										fullWidth
										label="Name"
										name="name"
										value={createForm.name}
										onChange={handleCreateChange}
										required
									/>

									<TextField
										fullWidth
										multiline
										rows={4}
										label="Description"
										name="description"
										value={createForm.description}
										onChange={handleCreateChange}
										required
									/>

									<TextField
										fullWidth
										type="number"
										label="Purchase Price"
										name="purchase_price"
										value={createForm.purchase_price || ''}  // Change here to handle 0 properly
										onChange={handleCreateChange}
										required
										inputProps={{
											min: 0,
											step: "any",  // Changed from 0.01 to allow any decimal input
											pattern: "[0-9]*[.,]?[0-9]*" // Add pattern for numeric input
										}}
									/>

									<TextField
										select
										fullWidth
										label="Manufacturer"
										name="manufacturer_id"
										value={createForm.manufacturer_id}
										onChange={handleCreateChange}
										required
									>
										{manufacturers.map((manufacturer) => (
											<MenuItem key={manufacturer.id} value={manufacturer.id}>
												{manufacturer.name}
											</MenuItem>
										))}
									</TextField>

									<Box
										sx={{
											border: '2px dashed',
											borderColor: 'primary.main',
											borderRadius: 1,
											p: 2,
											textAlign: 'center'
										}}
									>
										<input
											accept="image/*"
											style={{ display: 'none' }}
											id="raised-button-file"
											multiple
											type="file"
											onChange={handleFileChange}
										/>
										<label htmlFor="raised-button-file">
											<Button
												component="span"
												startIcon={<CloudUploadIcon />}
												variant="outlined"
											>
												Upload Images (1-3)
											</Button>
										</label>
										{selectedFiles.length > 0 && (
											<Typography variant="body2" sx={{ mt: 1 }}>
												{selectedFiles.length} file(s) selected
											</Typography>
										)}
									</Box>

									<ActionButton
										variant="contained"
										fullWidth
										onClick={handleCreateSubmit}
										disabled={!createForm.name || !createForm.description || selectedFiles.length === 0}
										sx={{
											mt: 2,
											height: '48px',
											fontSize: '16px'
										}}
									>
										Create Medication
									</ActionButton>
								</Box>
							</Paper>
						</Container>
					</Box>
				)}

				{/* Export Trends Section */}
				{!isLoading && (
					<Box
						id="export-section"
						sx={{
							py: 6,
							backgroundColor: 'white',
							position: 'relative',
							zIndex: 2
						}}
					>
						<Container maxWidth="sm">
							<Typography
								variant="h5"
								gutterBottom
								fontWeight={600}
								textAlign="center"
								color="primary"
								mb={4}
							>
								Export Trends
							</Typography>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									gap: 3
								}}
							>
								<Button
									variant="contained"
									onClick={() => handleExport('CSV')}
									startIcon={<FileDownloadIcon />}
									sx={{
										minWidth: 150,
										height: '48px'
									}}
								>
									Download as CSV
								</Button>
								<Button
									variant="outlined"
									onClick={() => handleExport('DOCX')}
									startIcon={<DescriptionIcon />}
									sx={{
										minWidth: 150,
										height: '48px'
									}}
								>
									Download as DOCX
								</Button>
							</Box>
						</Container>
					</Box>
				)}
			</Box>
		</>
	);
}