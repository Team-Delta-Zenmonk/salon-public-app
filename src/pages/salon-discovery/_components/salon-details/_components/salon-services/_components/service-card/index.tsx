import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Avatar, Box, Button, Chip, Collapse, IconButton } from "@mui/material";
import { useState } from "react";

const genderChip = (gender?: string) => {
  if (!gender) return null;
  const g = gender.toLowerCase();
  if (g === "male") return { label: "Men", sx: { bgcolor: "#e0f2fe", color: "#0369a1" } };
  if (g === "female") return { label: "Women", sx: { bgcolor: "#fce7f3", color: "#9d174d" } };
  return { label: "Unisex", sx: { bgcolor: "#ecfeff", color: "#155e75" } };
};

export default function ServiceCard({ service, subServices }: { service: any; subServices: any[] }) {
  const [open, setOpen] = useState(false);
  const hasSubServices = subServices.length > 0;

  const formatPrice = (s: any) => (s.price_type === "from" ? `From ₹${s.price}` : `₹${s.price}`);

  const onBook = (svc: any) => {
    console.log("Book service:", svc.uuid);
  };

  const parentGender = genderChip(service.gender);

  return (
    <Box className="border border-slate-200 rounded-xl bg-white ">
      <Box className="flex items-center justify-between p-4 gap-4">
        <Box className="flex items-start gap-3 flex-1">
          {service.logo ? (
            <img src={service.logo} alt={service.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <Avatar sx={{ width: 48, height: 48 }}>{service.name?.[0]}</Avatar>
          )}

          <Box className="flex-1">
            <Box className="font-medium">{service.name}</Box>
            <Box className="text-sm text-slate-500">{service.description}</Box>

            <Box className="flex flex-wrap gap-2 mt-2">
              <Chip size="small" label={formatPrice(service)} />
              {service.duration && <Chip size="small" variant="outlined" label={`${service.duration} min`} />}
              {parentGender && <Chip size="small" label={parentGender.label} sx={parentGender.sx} />}
            </Box>
          </Box>
        </Box>
        {!hasSubServices && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onBook(service)}
            className="border border-slate-900! text-slate-900!"
          >
            Book
          </Button>
        )}

        {hasSubServices && (
          <IconButton onClick={() => setOpen((v) => !v)}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        )}
      </Box>
      {hasSubServices && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="border-t border-slate-200 bg-slate-50 px-4 py-2">
            {subServices.map((sub) => {
              const subGender = genderChip(sub.gender);

              return (
                <Box key={sub.uuid} className="flex items-center justify-between gap-4 py-3">
                  <Box className="flex items-start gap-3 flex-1 min-w-0">
                    {sub.logo ? (
                      <img src={sub.logo} alt={sub.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#e2e8f0",
                          fontSize: 14,
                        }}
                      >
                        {sub.name?.[0]}
                      </Avatar>
                    )}

                    <Box className="min-w-0">
                      <Box className="font-medium text-sm truncate">{sub.name}</Box>
                      <Box className="text-xs text-slate-500 line-clamp-2">{sub.description}</Box>

                      <Box className="flex flex-wrap gap-2 mt-1">
                        {subGender && <Chip size="small" label={subGender.label} sx={subGender.sx} />}
                      </Box>
                    </Box>
                  </Box>
                  <Box className="text-right shrink-0">
                    <Box className="font-medium text-sm">{formatPrice(sub)}</Box>
                    {sub.duration && <Box className="text-xs text-slate-500">{sub.duration} min</Box>}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onBook(service)}
                      className="border border-slate-900! text-slate-900!"
                    >
                      Book
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
