import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate, useLocation } from "react-router-dom";
import { MONTH_FULL, WEEKDAY_FULL } from "../../common/date.constants";

export default function BookingSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking;

    const dateObj = booking?.booking_date ? new Date(booking.booking_date) : new Date();

    return (
        <Box className="min-h-full bg-(--app-bg) flex items-center justify-center p-4 sm:p-6">
            <Paper className="max-w-md w-full rounded-[32px] p-8 sm:p-10 text-center border border-(--app-border) shadow-xl bg-(--app-surface)">
                <Box className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircleOutlineIcon className="text-green-500 text-5xl" />
                </Box>

                <Typography className="font-extrabold text-2xl sm:text-3xl text-(--app-text) mb-2">
                    Booking Confirmed!
                </Typography>
                <Typography className="text-(--app-muted) text-sm sm:text-base mb-8">
                    Your appointment has been successfully booked and paid for.
                </Typography>

                <Box className="bg-(--app-surface-alt) rounded-2xl p-6 mb-8 border border-(--app-border) text-left space-y-4">
                    <Box className="flex items-center gap-3">
                        <StorefrontIcon className="text-(--app-muted) text-xl" />
                        <Box>
                            <Typography className="text-[10px] text-(--app-muted) font-bold uppercase tracking-wider">Salon</Typography>
                            <Typography className="text-sm font-bold text-(--app-text)">{booking?.salon?.name || "Awesome Salon"}</Typography>
                        </Box>
                    </Box>

                    <Box className="flex items-center gap-3">
                        <CalendarMonthIcon className="text-(--app-muted) text-xl" />
                        <Box>
                            <Typography className="text-[10px] text-(--app-muted) font-bold uppercase tracking-wider">Date</Typography>
                            <Typography className="text-sm font-bold text-(--app-text)">
                                {`${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_FULL[dateObj.getUTCMonth()]}`}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="flex items-center gap-3">
                        <AccessTimeIcon className="text-(--app-muted) text-xl" />
                        <Box>
                            <Typography className="text-[10px] text-(--app-muted) font-bold uppercase tracking-wider">Time</Typography>
                            <Typography className="text-sm font-bold text-(--app-text)">
                                {booking?.booking_start_time ? new Date(booking.booking_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Morning Slot"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="flex flex-col gap-3">
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        className="rounded-xl font-bold py-3.5"
                        onClick={() => navigate("/bookings")}
                    >
                        View My Bookings
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        className="rounded-xl font-bold py-3.5 border-(--app-border) text-(--app-text)"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
