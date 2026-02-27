import { Box, Typography, Avatar, IconButton, Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { removeItemLocal, updateItemLocalStaff } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import { updateCartItemAction } from "../../../../features/salon/cart/update-item/update-item.action";
import ConfirmRemoveItemDialog from "../remove-item-dialog";
import { getServiceStaffsAction } from "../../../../features/salon/staff/get-service-staffs/get-service-staffs.action";
import ConfirmStaffDialog from "./_components/confirm-staff-dialog";

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { isGuest, salonId } = useAppSelector((s) => s.cart);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pendingStaffEntry, setPendingStaffEntry] = useState<any>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const service = item.service;
  const name = service?.name ?? "Service";
  const image = service?.logo;
  const duration = item.duration;
  const price = item.final_price ?? item.base_price;
  const gender = service?.gender;
  const selectedStaffId = item.staff?.uuid ?? item.staff_uuid ?? null;

  useEffect(() => {
    if (!service?.uuid || !salonId) return;

    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const data = await dispatch(getServiceStaffsAction({ serviceUuid: service.uuid, salonId })).unwrap();
        setStaffList(data);
      } catch {
        setStaffList([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, [service?.uuid]);

  const onStaffClick = (entry: any) => {
    if (updating) return;
    if (entry.staff?.uuid === selectedStaffId) return;
    setPendingStaffEntry(entry);
    setStaffDialogOpen(true);
  };

  const onConfirmStaff = async () => {
    if (!pendingStaffEntry) return;
    setStaffDialogOpen(false);

    if (isGuest) {
      dispatch(
        updateItemLocalStaff({
          service_id: item.service_id,
          staff: pendingStaffEntry.staff,
          staff_uuid: pendingStaffEntry.staff.uuid,
          price: pendingStaffEntry.price,
          duration: pendingStaffEntry.duration,
        }),
      );
      setPendingStaffEntry(null);
      return;
    }

    setUpdating(true);
    try {
      await dispatch(
        updateCartItemAction({
          itemUuid: item.uuid,
          staffUuid: pendingStaffEntry.staff.uuid,
        }),
      ).unwrap();
    } finally {
      setUpdating(false);
      setPendingStaffEntry(null);
    }
  };

  const onCancelStaff = () => {
    setStaffDialogOpen(false);
    setPendingStaffEntry(null);
  };

  const onConfirmRemove = () => {
    if (isGuest) {
      dispatch(removeItemLocal(item.service_id));
    } else {
      dispatch(removeCartItemAction(item.uuid));
    }
    setConfirmOpen(false);
  };

  const currentStaffEntry = selectedStaffId ? staffList.find((e) => e.staff?.uuid === selectedStaffId) : null;

  const currentStaffInfo = currentStaffEntry
    ? {
        name: `${currentStaffEntry.staff.first_name} ${currentStaffEntry.staff.last_name ?? ""}`.trim(),
        photo: currentStaffEntry.staff.photos?.secure_url ?? currentStaffEntry.staff.photos?.url,
      }
    : item.staff
      ? {
          name: `${item.staff.first_name} ${item.staff.last_name ?? ""}`.trim(),
          photo: item.staff.photos?.secure_url ?? item.staff.photos?.url,
        }
      : null;

  const newStaffInfo = pendingStaffEntry
    ? {
        name: `${pendingStaffEntry.staff.first_name} ${pendingStaffEntry.staff.last_name ?? ""}`.trim(),
        photo: pendingStaffEntry.staff.photos?.secure_url ?? pendingStaffEntry.staff.photos?.url,
      }
    : null;

  return (
    <>
      <Box className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-150 hover:border-slate-300 hover:shadow-sm">
        <Box className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5">
          <Avatar
            src={image}
            variant="rounded"
            className="rounded-xl shrink-0"
            sx={{ width: { xs: 56, sm: 72 }, height: { xs: 56, sm: 72 }, borderRadius: 2 }}
          />

          <Box className="flex-1 min-w-0">
            <Typography className="font-bold text-sm sm:text-base text-slate-900 truncate">{name}</Typography>
            <Box className="flex items-center gap-1.5 mt-1">
              <AccessTimeIcon className="text-slate-400" sx={{ fontSize: 13 }} />
              <Typography variant="caption" className="text-slate-400 text-xs sm:text-[13px]">
                {duration} min
                {gender && (
                  <>
                    <Box component="span" className="mx-1.5 text-slate-300">
                      •
                    </Box>
                    <Box component="span" className="capitalize">
                      {gender}
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
            {selectedStaffId && currentStaffInfo && (
              <Box className="flex items-center gap-1.5 mt-1.5">
                <Avatar src={currentStaffInfo.photo} sx={{ width: 18, height: 18, fontSize: 10 }}>
                  {currentStaffInfo.name?.[0]}
                </Avatar>
                <Typography variant="caption" className="text-slate-500 text-[11px]">
                  {currentStaffInfo.name}
                </Typography>
                <Box className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </Box>
            )}
          </Box>

          <Box className="flex items-center gap-3 shrink-0">
            <Typography className="font-extrabold text-base sm:text-lg text-slate-900 leading-none">
              ₹{price}
            </Typography>
            <IconButton
              onClick={() => setConfirmOpen(true)}
              className="text-slate-300 border border-slate-100 rounded-xl transition-all duration-150 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
              sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}
            >
              <DeleteOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </Box>
        </Box>
        <Box className="border-t border-slate-100 px-4 sm:px-5 py-3">
          <Box className="flex items-center justify-between mb-2">
            <Typography variant="caption" className="text-slate-400 font-semibold tracking-wide uppercase text-[10px]">
              Select Staff
            </Typography>
            {selectedStaffId && (
              <Typography variant="caption" className="text-emerald-500 font-semibold text-[10px]">
                ✓ Assigned
              </Typography>
            )}
          </Box>

          {staffLoading ? (
            <Box className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <Box key={i} className="flex flex-col items-center gap-1">
                  <Skeleton variant="circular" width={44} height={44} />
                  <Skeleton variant="text" width={40} height={12} />
                </Box>
              ))}
            </Box>
          ) : staffList.length === 0 ? (
            <Typography variant="caption" className="text-slate-400 block">
              No staff assigned to this service
            </Typography>
          ) : (
            <Box className="flex gap-4 flex-wrap">
              {staffList.map((entry: any) => {
                const staff = entry.staff;
                const isSelected = selectedStaffId === staff?.uuid;
                const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();
                const photo = staff?.photos?.secure_url ?? staff?.photos?.url;
                const staffPrice = entry.price;

                return (
                  <Box
                    key={entry.uuid}
                    onClick={() => onStaffClick(entry)}
                    className={`flex flex-col items-center gap-1 cursor-pointer group transition-opacity duration-150 ${
                      updating ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Box className="relative">
                      <Avatar
                        src={photo}
                        sx={{
                          width: 44,
                          height: 44,
                          border: isSelected ? "2.5px solid #0f172a" : "2.5px solid transparent",
                          outline: isSelected ? "none" : "2px solid #e2e8f0",
                          transition: "all 0.15s",
                        }}
                        className="group-hover:outline-slate-300"
                      >
                        {staffName?.[0]}
                      </Avatar>
                      {isSelected && (
                        <Box className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                          <CheckIcon sx={{ fontSize: 10, color: "#fff" }} />
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      className={`text-[11px] text-center max-w-13 truncate leading-tight ${
                        isSelected ? "text-slate-900 font-bold" : "text-slate-500"
                      }`}
                    >
                      {staffName || "Staff"}
                    </Typography>

                    {staffPrice && (
                      <Typography
                        variant="caption"
                        className={`text-[10px] ${isSelected ? "text-slate-700 font-semibold" : "text-slate-400"}`}
                      >
                        ₹{Math.round(parseFloat(String(staffPrice)))}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmRemoveItemDialog
        open={confirmOpen}
        serviceName={name}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirmRemove}
      />

      <ConfirmStaffDialog
        open={staffDialogOpen}
        currentStaff={currentStaffInfo}
        newStaff={newStaffInfo}
        price={pendingStaffEntry?.price}
        duration={pendingStaffEntry?.duration}
        onConfirm={onConfirmStaff}
        onCancel={onCancelStaff}
      />
    </>
  );
}
