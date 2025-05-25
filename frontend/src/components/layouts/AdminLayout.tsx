import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { AdminHeader } from "@/components/header/AdminHeader";
import { useEffect, useState } from "react";
import type { UserDto } from "@/types/dtos";
import { userService } from "@/services/user-service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function AdminLayout() {
	const [users, setUsers] = useState<UserDto[]>([]);

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const all = await userService.getUsers();
				setUsers(all);
			} catch (error: unknown) {
				console.log(error);
			}
		}

		getAllUsers();
	}, []);

	// Prepare data for role chart
	const roleData = users.reduce((acc, user) => {
		const role = user.role;
		acc[role] = (acc[role] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const roleChartData = Object.entries(roleData).map(([role, count]) => ({
		role: role.charAt(0).toUpperCase() + role.slice(1),
		count
	}));

	// Prepare data for notification preference chart
	const notificationData = users.reduce((acc, user) => {
		const preference = user.notification_preference;
		acc[preference] = (acc[preference] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const notificationChartData = Object.entries(notificationData).map(([preference, count]) => ({
		preference: preference.toUpperCase(),
		count
	}));

	return (
		<>
			{/* Hero Section with Charts */}
			<Box
				sx={{
					minHeight: '90vh',
					width: '100vw',
					backgroundImage: "linear-gradient(54deg,rgba(39, 44, 48, 1) 63%, rgba(94, 89, 97, 1) 99%);",
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
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
				<AdminHeader />

				{/* Charts Container */}
				<Container
					maxWidth="lg"
					sx={{
						position: 'relative',
						zIndex: 2,
						mt: 8 // Account for header
					}}
				>
					<Box
						display="flex"
						gap={4}
						flexDirection={{ xs: 'column', md: 'row' }}
						justifyContent="center"
					>
						{/* Role Distribution Chart */}
						<Paper
							elevation={8}
							sx={{
								p: 3,
								flex: 1,
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: 3
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
								Role distribution
							</Typography>
							<Box sx={{ width: '100%', height: 300 }}>
								<ResponsiveContainer>
									<BarChart data={roleChartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="role" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey="count"
											fill="#36454F"
											name="Number of Users"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</Box>
						</Paper>

						{/* Notification Preference Chart */}
						<Paper
							elevation={8}
							sx={{
								p: 3,
								flex: 1,
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: 3
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
								Notification Preferences
							</Typography>
							<Box sx={{ width: '100%', height: 300 }}>
								<ResponsiveContainer>
									<BarChart data={notificationChartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="preference" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey="count"
											fill="#36454F"
											name="Number of Users"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</Box>
						</Paper>
					</Box>
				</Container>
			</Box>

			{/* Users Table Section */}
			<Box
				id="users"
				sx={{
					py: 6,
					backgroundColor: '#f5f5f5',
					minHeight: '50vh'
				}}
			>
				<Container maxWidth="lg">
					<Typography
						variant="h4"
						gutterBottom
						fontWeight={600}
						textAlign="center"
						mb={4}
					>
						User Management
					</Typography>

					<Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
						<TableContainer sx={{ maxHeight: 600 }}>
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											ID
										</TableCell>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											Name
										</TableCell>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											Email
										</TableCell>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											Phone
										</TableCell>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											Role
										</TableCell>
										<TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
											Notification
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user) => (
										<TableRow
											key={user.id}
											sx={{
												'&:hover': {
													backgroundColor: '#f5f5f5'
												}
											}}
										>
											<TableCell>{user.id}</TableCell>
											<TableCell sx={{ fontWeight: 500 }}>
												{user.name}
											</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.phone_number}</TableCell>
											<TableCell>
												<Chip
													label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
													size="small"
													variant="outlined"
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={user.notification_preference.toUpperCase()}
													size="small"
												/>
											</TableCell>
										</TableRow>
									))}
									{users.length === 0 && (
										<TableRow>
											<TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
												<Typography color="text.secondary">
													No users found
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Container>
			</Box>
		</>
	);
}