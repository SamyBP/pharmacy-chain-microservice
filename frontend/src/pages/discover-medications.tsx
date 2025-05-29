import { CarousellSwitcher } from "@/components/animations/CarouselSwitcher";
import { Header } from "@/components/header/Header";
import { useMedication } from "@/hooks/use-medication";
import type { MedicationDto } from "@/types/dtos";
import { getMedicationImageFullUrl } from "@/utils";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from 'react';

export default function DiscoverMedications() {
	const { medications } = useMedication();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredMedications, setFilteredMedications] = useState<MedicationDto[]>(medications);

	useEffect(() => {
		setFilteredMedications(medications);
	}, [medications]);

	const handleSearch = () => {
		if (!searchTerm.trim()) {
			setFilteredMedications(medications);
			return;
		}

		const searchValue = searchTerm.toLowerCase().trim();
		const filtered = medications.filter(med => {
			const medicationName = med.name.toLowerCase();
			const medicationDesc = med.description.toLowerCase();
			const manufacturerName = med.manufacturer.name.toLowerCase();

			return medicationName.includes(searchValue) ||
				medicationDesc.includes(searchValue) ||
				manufacturerName.includes(searchValue);
		});

		setFilteredMedications(filtered);
	};

	const SearchBar = (
		<Box sx={{ display: 'flex', gap: 1 }}>
			<TextField
				placeholder="Search medications..."
				size="small"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						handleSearch();
					}
				}}
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
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={handleSearch}
								sx={{ color: 'inherit' }}
							>
								<SearchIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</Box>
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
						mt: 4
					}}
				>
					{filteredMedications.length > 0 ? (
						<CarousellSwitcher paginate={3} autoShuffle={false}>
							{filteredMedications.map((medication) => (
								<Card
									key={medication.id}
									sx={{
										borderRadius: 2,
										height: 300,
										minWidth: 400,
										width: {
											xs: '100%',
											sm: '300px',
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
						</CarousellSwitcher>
					) : (
						<Box
							sx={{
								py: 8,
								textAlign: 'center',
								width: '100%'
							}}
						>
							<Typography color="white">
								No medications found
							</Typography>
						</Box>
					)}
				</Container>
			</Box>
		</>
	);
}