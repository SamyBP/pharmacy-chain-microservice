import { AdminHeader } from "@/components/header/AdminHeader";
import { userService } from "@/services/user-service";
import type { InviteUserDto, UserDto } from "@/types/dtos";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Chip, Container, IconButton, MenuItem, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActionButton } from "../common/ActionButton";
import { useHandler } from "@/hooks/use-handler";
import { useNotifier } from "@/hooks/use-notifier";
import { usePharmacies } from "@/hooks/use-pharmacies";

export default function AdminLayout() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const { withErrorHandling } = useHandler()
	const { notifier } = useNotifier()
	const { pharmacies } = usePharmacies()

	useEffect(() => {
		withErrorHandling(async () => {
			const all = await userService.getUsers();
			setUsers(all)
		})
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

	const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
	const [editForm, setEditForm] = useState({ name: '', phone_number: '' });
	const [openModal, setOpenModal] = useState(false);

	const handleRowClick = (user: UserDto) => {
		setSelectedUser(user);
		setEditForm({ name: user.name, phone_number: user.phone_number });
		setOpenModal(true);
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditForm((prev) => ({ ...prev, [name]: value }));

	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedUser) {
			return
		}

		const payload = {
			phone_number: editForm.phone_number,
			name: editForm.name
		}

		console.log(payload)

		await withErrorHandling(async () => {
			const email = selectedUser.email
			const updatedUser: UserDto =  await userService.updateUser(selectedUser.id, payload)
			notifier.success(`Succesfully updated user ${email}`)
			setUsers(prevUsers => prevUsers.map(user => 
            user.id === updatedUser.id ? updatedUser : user
			))
		})

		setOpenModal(false)
	}

	const handleDelete = (user: UserDto) => {
		withErrorHandling(async () => {
			const username = user.name
			await userService.deleteUser(user.id)
			setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id))
			notifier.success(`Successfully deleted user: ${username}`)
		})
	};

	const [inviteForm, setInviteForm] = useState<InviteUserDto>({ email: '', role: 'EMPLOYEE', pharmacy_id: 1 });
	const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInviteForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleInviteSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await withErrorHandling(async () => {
			const response = await userService.inviteUser(inviteForm)
			notifier.info(response.message)
		})
	};

	return (
		<>
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

				<Container
					maxWidth="lg"
					sx={{
						position: 'relative',
						zIndex: 2,
						mt: 8
					}}
				>
					<Box
						display="flex"
						gap={4}
						flexDirection={{ xs: 'column', md: 'row' }}
						justifyContent="center"
					>
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
											hover
											sx={{ cursor: 'pointer' }}
											onClick={() => handleRowClick(user)}
										>
											<TableCell>{user.id}</TableCell>
											<TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
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
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														width: '140px',
													}}
												>
													<Chip
														label={user.notification_preference.toUpperCase()}
														size="small"
													/>
													<IconButton
														size="small"
														color="error"
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(user);
														}}
													>
														<DeleteIcon />
													</IconButton>
												</Box>
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

			{/* Invite form section */}
			<Box id="invite"
				sx={{
					py: 6,
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
				<Container maxWidth="sm" sx={{ zIndex: 1000 }}>
					<Typography variant="h5" gutterBottom fontWeight={600} textAlign="center" color="primary.light">
						Invite a New User
					</Typography>
					<Paper sx={{ p: 4, borderRadius: 2, backgroundColor: 'primary.light' }}>
						<Box>
							<TextField
								fullWidth
								label="Email"
								name="email"
								value={inviteForm.email}
								onChange={handleInviteChange}
								margin="normal"
								required
							/>
							<Box sx={{
								display: "flex",
								flexDirection: "row",
								gap: 1
							}}>
								<TextField
									fullWidth
									select
									label="Role"
									name="role"
									value={inviteForm.role}
									onChange={handleInviteChange}
									margin="normal"
									required
								>
									{["ADMIN", "MANAGER", "EMPLOYEE"].map((role) => (
										<MenuItem key={role} value={role}>
											{role}
										</MenuItem>
									))}
								</TextField>
								<TextField
										fullWidth
										select
										label="Pharmacy"
										name="pharmacy_id"
										value={inviteForm.pharmacy_id}
										onChange={handleInviteChange}
										margin="normal"
										required
								>
										{pharmacies.map((pharmacy) => (
												<MenuItem key={pharmacy.id} value={pharmacy.id}>
														{pharmacy.name}
												</MenuItem>
										))}
								</TextField>
							</Box>
							
							<ActionButton fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleInviteSubmit}>
								Send Invite
							</ActionButton>
						</Box>
					</Paper>
				</Container>
			</Box>

			<Modal
				open={openModal}
				onClose={() => setOpenModal(false)}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				BackdropProps={{
					sx: {
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						transition: 'opacity 0.3s ease-in-out',
					}
				}}
			>
				<Paper
					sx={{
						width: '60vw',
						height: '70vh',
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
						outline: 'none',
						transform: openModal ? 'scale(1)' : 'scale(0.8)',
						opacity: openModal ? 1 : 0,
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					}}
				>
					{/* Modal Header */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							p: 3,
							borderBottom: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Typography variant="h5" component="h2">
							Edit User: {selectedUser?.name}
						</Typography>
						<IconButton onClick={() => setOpenModal(false)}>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Modal Content */}
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							p: 3,
						}}
					>
						<Box style={{ width: '100%', maxWidth: '400px' }}>
							<Stack spacing={3}>
								<TextField
									fullWidth
									label="Name"
									name="name"
									value={editForm.name}
									onChange={handleEditChange}
									variant="outlined"
								/>
								<TextField
									fullWidth
									label="Phone Number"
									name="phone_number"
									value={editForm.phone_number}
									onChange={handleEditChange}
									variant="outlined"
								/>
								<ActionButton
									variant="contained"
									size="large"
									fullWidth
									sx={{
										mt: 2,
										fontSize: '16px',
										textTransform: 'none',
										height: '48px',
									}}
									onClick={handleEditSubmit}
								>
									Save Changes
								</ActionButton>
							</Stack>
						</Box>
					</Box>
				</Paper>
			</Modal>

		</>
	);
}