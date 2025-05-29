import { useAuth } from "@/hooks/use-auth";
import { useHandler } from "@/hooks/use-handler";
import { useNotifier } from "@/hooks/use-notifier";
import { pharmacyService } from "@/services/pharmacy-service";
import type { MedicationDto, RegisterInventoryRequest, SaleItemDto } from "@/types/dtos";
import { getMedicationImageFullUrl } from "@/utils";
import { Box, Card, CardContent, CircularProgress, Container, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarousellSwitcher } from "../animations/CarouselSwitcher";
import { ActionButton } from "../common/ActionButton";
import { EmployeeHeader } from "../header/EmployeeHeader";
import AddIcon from '@mui/icons-material/Add';

export default function EmployeeLayout() {
	const [isLoading, setIsLoading] = useState(true);
	const [medications, setMedications] = useState<MedicationDto[]>([]);
	const { withErrorHandling } = useHandler();
	const { user } = useAuth();
	const { notifier } = useNotifier();
	const navigate = useNavigate();

	if (!user) {
		notifier.warning("You are not authorized here");
		navigate("/");
		return null;
	}

	const pharmacyId = user.pharmacies[0];

	// Sale form state
	const [saleItems, setSaleItems] = useState<SaleItemDto[]>([]);
	const [currentSaleItem, setCurrentSaleItem] = useState<SaleItemDto>({
		medication_id: 0,
		quantity: 1,
		unit_price: 0
	});

	// Inventory update form state
	const [inventoryForm, setInventoryForm] = useState<RegisterInventoryRequest>({
		medication_id: 0,
		quantity: 0,
		expiration_date: ''
	});

	useEffect(() => {
		withErrorHandling(async () => {
			setIsLoading(true);
			const meds = await pharmacyService.getMedicationsFromEmployeesPharmacy(pharmacyId);
			setMedications(meds);
			setIsLoading(false);
		});
	}, [pharmacyId]);

	const handleAddSaleItem = () => {
		if (currentSaleItem.medication_id === 0) {
			notifier.error("Please select a medication");
			return;
		}
		setSaleItems([...saleItems, currentSaleItem]);
		setCurrentSaleItem({
			medication_id: 0,
			quantity: 1,
			unit_price: 0
		});
	};

	const handleSaleSubmit = async () => {
		if (saleItems.length === 0) {
			notifier.error("Please add at least one medication to the sale");
			return;
		}
		console.log("sale items", saleItems)

		await withErrorHandling(async () => {
			await pharmacyService.performMedicationSale(pharmacyId, {
				sale_items: saleItems
			});
			notifier.success("Sale completed successfully");
		});
		setSaleItems([]);
	};

	const handleInventoryDateChange = (date: Date | null) => {
		if (date) {
			setInventoryForm(prev => ({
				...prev,
				expiration_date: date.toISOString()
			}));
		}
	};

	const handleInventorySubmit = () => {
		withErrorHandling(async () => {
			await pharmacyService.updatePharmacyInventory(pharmacyId, inventoryForm);
			notifier.success("Inventory updated successfully");
			setInventoryForm({
				medication_id: 0,
				quantity: 0,
				expiration_date: ''
			});
		});
	};

	return (
		<>
			<Box
				id="medications"
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
				<EmployeeHeader />

				{/* Medications Section */}
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
							mb: 4
						}}
					>
						<CarousellSwitcher interval={6000} paginate={3}>
							{medications.map((medication) => (
								<Card
									key={medication.id}
									sx={{
										borderRadius: 2,
										height: 300,
										minWidth: 400,
										width: {
											xs: '100%',
											sm: '300px', // Adjusted width to fit 3 cards
										},
										transition: 'transform 0.3s ease, box-shadow 0.3s ease',
										background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
										boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
										'&:hover': {
											transform: 'scale(1.02)',
											boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
										},
										display: 'flex',
										overflow: 'hidden',
									}}
								>
									<Box
										sx={{
											width: '90%',
											height: '100%',
											position: 'relative',
											bgcolor: 'grey.50',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Box
											component="img"
											src={getMedicationImageFullUrl(medication.images[0].image_url)}
											alt={medication.images[0].alt_text}
											sx={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												p: 0,
											}}
										/>
									</Box>
									<CardContent
										sx={{
											width: '60%',
											p: 3,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="h6" fontWeight={600}>
											{medication.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{medication.description}
										</Typography>
										<Typography variant="subtitle2" color="primary.main">
											{medication.manufacturer.name}
										</Typography>
									</CardContent>
								</Card>
							))}
						</CarousellSwitcher>
					</Container>
				)}

				{/* Sale Form Section */}
				{isLoading ? (<></>) : (
					<Box
						id="sales"
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
								Register New Sale
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
										label="Medication"
										value={currentSaleItem.medication_id}
										onChange={(e) => setCurrentSaleItem({
											...currentSaleItem,
											medication_id: Number(e.target.value)
										})}
									>
										{medications.map((med) => (
											<MenuItem key={med.id} value={med.id}>
												{med.name}
											</MenuItem>
										))}
									</TextField>

									<TextField
										fullWidth
										label="Quantity"
										type="number"
										value={currentSaleItem.quantity}
										onChange={(e) => setCurrentSaleItem({
											...currentSaleItem,
											quantity: Number(e.target.value)
										})}
										inputProps={{ 
												min: 1,
												step: 1,
												pattern: '[0-9]*'
										}}
									/>

									<TextField
										fullWidth
										label="Unit Price"
										type="number"
										value={currentSaleItem.unit_price}
										onChange={(e) => setCurrentSaleItem({
											...currentSaleItem,
											unit_price: Number(e.target.value)
										})}
										inputProps={{ 
												min: 1.0,
												step: 1.0,
												pattern: '[0-9]*'
										}}
									/>

									<ActionButton
										variant="outlined"
										onClick={handleAddSaleItem}
										startIcon={<AddIcon />}
									>
										Add Item
									</ActionButton>

									{saleItems.length > 0 && (
										<Box sx={{ mt: 2 }}>
											<Typography variant="h6" gutterBottom>
												Current Sale Items:
											</Typography>
											{saleItems.map((item, index) => {
												const med = medications.find(m => m.id === item.medication_id);
												return (
													<Typography key={index}>
														{med?.name} - Qty: {item.quantity} - Price: ${item.unit_price}
													</Typography>
												);
											})}
										</Box>
									)}

									<ActionButton
										variant="contained"
										onClick={handleSaleSubmit}
										disabled={saleItems.length === 0}
									>
										Complete Sale
									</ActionButton>
								</Box>
							</Paper>
						</Container>
					</Box>
				)}

				{/* Inventory Update Section */}
				{isLoading ? (<></>) : (
					<Box
						id="inventory"
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
								Update Inventory
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
										label="Medication"
										value={inventoryForm.medication_id}
										onChange={(e) => setInventoryForm({
											...inventoryForm,
											medication_id: Number(e.target.value)
										})}
									>
										{medications.map((med) => (
											<MenuItem key={med.id} value={med.id}>
												{med.name}
											</MenuItem>
										))}
									</TextField>

									<TextField
										fullWidth
										label="Quantity"
										type="number"
										value={inventoryForm.quantity}
										onChange={(e) => setInventoryForm({
											...inventoryForm,
											quantity: Number(e.target.value)
										})}
										inputProps={{ min: 1 }}
									/>

									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											label="Expiration Date"
											value={inventoryForm.expiration_date ? new Date(inventoryForm.expiration_date) : null}
											onChange={handleInventoryDateChange}
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
										onClick={handleInventorySubmit}
										disabled={!inventoryForm.medication_id || !inventoryForm.quantity || !inventoryForm.expiration_date}
									>
										Update Inventory
									</ActionButton>
								</Box>
							</Paper>
						</Container>
					</Box>
				)}
			</Box>
		</>
	);
}