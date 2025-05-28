import { ActionButton } from "@/components/common/ActionButton";
import { useHandler } from "@/hooks/use-handler";
import { useNotifier } from "@/hooks/use-notifier";
import { userService } from "@/services/user-service";
import type { CompleteRegistrationDto } from "@/types/dtos";
import type { NotificationPreference } from "@/types/utils";
import { Box, Container, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const notificationPreferences: NotificationPreference[] = ["EMAIL", "SMS"];

export default function CompleteAccount() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { withErrorHandling } = useHandler();
	const { notifier } = useNotifier();

	const [formData, setFormData] = useState<CompleteRegistrationDto>({
		invite_token: "",
		password: "",
		phone_number: "",
		name: "",
		notification_preference: "EMAIL"
	});

	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const token = searchParams.get("token");
		if (!token || !isValidJwtFormat(token)) {
			notifier.error("Invalid invitation token");
			navigate("/");
			return;
		}
		setFormData(prev => ({ ...prev, invite_token: token }));
	}, [searchParams]);

	const isValidJwtFormat = (token: string): boolean => {
		const parts = token.split(".");
		return parts.length === 3;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		if (formData.password !== confirmPassword) {
			notifier.error("Passwords do not match");
			return;
		}

		const formattedData = {
        ...formData,
        phone_number: formData.phone_number.startsWith('+4') 
            ? formData.phone_number 
            : `+4${formData.phone_number}`
    };

    await withErrorHandling(async () => {
        const response = await userService.register(formattedData);
        notifier.success(response.message);
        navigate("/");
    });
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
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
			<Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
				<Typography
					variant="h4"
					textAlign="center"
					mb={4}
					sx={{ color: 'primary.light' }}
				>
					Complete Your Registration
				</Typography>

				<Paper
					elevation={8}
					sx={{
						p: 4,
						borderRadius: 2,
						backgroundColor: 'white',
					}}
				>
					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Full name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
						<Box sx={{
							display: 'flex',
							gap: 2
						}}>
							<TextField
								fullWidth
								label="Password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
							<TextField
								fullWidth
								label="Confirm Password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</Box>

						<TextField
							fullWidth
							label="Phone Number"
							name="phone_number"
							value={formData.phone_number}
							onChange={handleChange}
							required
							InputProps={{
								startAdornment: <Box sx={{ color: 'text.secondary', mr: 1 }}>+4</Box>
							}}
						/>

						

						<TextField
							select
							fullWidth
							label="Notification Preference"
							name="notification_preference"
							value={formData.notification_preference}
							onChange={handleChange}
							required
						>
							{notificationPreferences.map((pref) => (
								<MenuItem key={pref} value={pref}>
									{pref}
								</MenuItem>
							))}
						</TextField>

						<ActionButton
							variant="contained"
							fullWidth
							onClick={handleSubmit}
							sx={{
								mt: 2,
								height: '48px',
								fontSize: '16px'
							}}
						>
							Complete Registration
						</ActionButton>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}