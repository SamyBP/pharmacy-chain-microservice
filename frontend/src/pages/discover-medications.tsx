import { Header } from "@/components/header/Header";
import { useMedication } from "@/hooks/use-medication";
import type { MedicationDto } from "@/types/dtos";
import { getMedicationImageFullUrl } from "@/utils";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Container, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DiscoverMedications() {
	const { medications } = useMedication();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredMedications, setFilteredMedications] = useState<MedicationDto[]>([]);

	useEffect(() => {
		const filtered = medications.filter(med =>
			med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			med.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredMedications(filtered);
	}, [searchTerm, medications]);

	const SearchBar = (
		<TextField
			placeholder="Search medications..."
			size="small"
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
			sx={{
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				borderRadius: 1,
				'& .MuiInputBase-root': {
					color: 'inherit',
				},
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: 'rgba(255, 255, 255, 0.3)',
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					borderColor: 'rgba(255, 255, 255, 0.5)',
				},
			}}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon sx={{ color: 'inherit' }} />
					</InputAdornment>
				),
			}}
		/>
	);

	return (
		<>
			<Box sx={{
				minHeight: '100vh',
				width: '100%',
				backgroundImage: "linear-gradient(54deg,rgba(39, 44, 48, 1) 63%, rgba(94, 89, 97, 1) 99%);",
				position: 'relative',
				pt: 8,
				pb: 4,
				overflow: 'auto',
			}}>
				<Header endComponent={SearchBar} />
			
				<Container 
					maxWidth="xl" 
					sx={{ 
						position: 'relative',
						zIndex: 2,
						px: { xs: 2, sm: 3 },
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 3,
							justifyContent: 'center',
							alignItems: 'stretch',
						}}
					>
						{filteredMedications.map((medication) => (
							<Card
								key={medication.id}
								sx={{
									borderRadius: 2,
									height: 300,
									width: {
										xs: '100%',
										sm: '400px',
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
										width: '80%',
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
										width: '55%',
										p: 2,
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
									}}
								>
									<Typography 
										variant="h6" 
										fontWeight={600}
										fontSize="1rem"
										gutterBottom
										noWrap
									>
										{medication.name}
									</Typography>
									<Typography 
										variant="body2" 
										color="text.secondary"
										sx={{
											flexGrow: 1,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
										}}
									>
										{medication.description}
									</Typography>
									<Typography 
										variant="subtitle2" 
										color="primary.main"
										fontWeight={500}
										sx={{ pt: 1 }}
									>
										{medication.manufacturer.name}
									</Typography>
								</CardContent>
							</Card>
						))}
						{filteredMedications.length === 0 && (
							<Box
								sx={{
									py: 8,
									textAlign: 'center',
									width: '100%'
								}}
							>
								<Typography color="text.secondary">
									No medications found
								</Typography>
							</Box>
						)}
					</Box>
				</Container>
			</Box>
		</>
	);
}