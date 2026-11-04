"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Avatar, CircularProgress } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useStorefrontNavigate } from "@/common/hooks/useStorefrontNavigate";
import { callSnack } from "@/components/snackbar";
import { uploadCustomerProfileImage } from "@/features/customer/update-profile/update-profile.service";
import { updateCustomerProfileAction } from "@/features/customer/update-profile/update-profile.action";
import { createZodResolver } from "@/common/utils/zod-resolver";
import CustomSelect from "@/components/custom-select";
import CustomInput from "@/components/custom-input";
import { FIELD_LIMITS } from "@/common/field-limits";
import { VALIDATE_PATTERN } from "@/common/validate-pattern";
import {
  editCustomerProfileSchema,
  GENDER_OPTIONS,
  type EditCustomerProfileFormValues,
} from "@/features/customer/update-profile/edit-profile.schema";
import styles from "./edit-profile.module.css";

export default function EditProfileView() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  
  const { customer } = useAppSelector((state) => state.auth);

  const initialValues: EditCustomerProfileFormValues = {
    name: customer?.name || "",
    phone_number: customer?.phone_number || customer?.phone || "",
    gender: customer?.gender || "",
    profile_image: customer?.profile_image || customer?.picture || "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<EditCustomerProfileFormValues>({
    resolver: createZodResolver(editCustomerProfileSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || "",
        phone_number: customer.phone_number || customer.phone || "",
        gender: customer.gender || "",
        profile_image: customer.profile_image || customer.picture || "",
      });
    }
  }, [customer, reset]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchedName = watch("name");
  const watchedProfileImage = watch("profile_image");

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      callSnack("Please select a valid image file", "error");
      return;
    }

    try {
      setIsUploading(true);
      const uploaded = await uploadCustomerProfileImage(file);
      const imageUrl = uploaded.secure_url || uploaded.url;
      setValue("profile_image", imageUrl, { shouldDirty: true, shouldValidate: true });
      callSnack("Photo uploaded successfully", "success");
    } catch (err: any) {
      callSnack(err?.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (values: EditCustomerProfileFormValues) => {
    if (!isDirty || isSaving || isUploading) return;

    try {
      setIsSaving(true);
      const payload: {
        name?: string;
        phone_number?: string | null;
        gender?: string | null;
        profile_image?: string | null;
      } = {};

      if (values.name !== (customer?.name || "")) {
        payload.name = values.name.trim();
      }
      if (values.phone_number !== (customer?.phone_number || customer?.phone || "")) {
        payload.phone_number = values.phone_number?.trim() || null;
      }
      if (values.gender !== (customer?.gender || "")) {
        payload.gender = values.gender?.trim() || null;
      }
      if (values.profile_image !== (customer?.profile_image || customer?.picture || "")) {
        payload.profile_image = values.profile_image || null;
      }

      await dispatch(updateCustomerProfileAction(payload)).unwrap();
      callSnack("Profile updated successfully", "success");
      navigate("/profile");
    } catch (err: any) {
      callSnack(
        err?.message || (typeof err === "string" ? err : "Failed to update profile"),
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = watchedName?.trim() || customer?.name || "Patron";

  return (
    <Box className={styles.editPage}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div>
              <h1 className={styles.title}>Update Profile</h1>
              <p className={styles.subtitle}>
                Keep your patron dossier details current and verified
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.avatarSection}>
              <Avatar
                src={watchedProfileImage || undefined}
                className={styles.avatarPreview}
              >
                {displayName[0]?.toUpperCase() || "P"}
              </Avatar>
              <div className={styles.avatarActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadBtn}
                  disabled={isUploading || isSaving}
                >
                  {isUploading ? (
                    <>
                      <CircularProgress size={16} sx={{ color: "inherit" }} />
                      <span>UPLOADING...</span>
                    </>
                  ) : (
                    <>
                      <CloudUploadOutlinedIcon fontSize="small" />
                      <span>CHANGE PHOTO</span>
                    </>
                  )}
                </button>
                <span className={styles.avatarHint}>
                  JPG, PNG or WebP up to 5MB
                </span>
              </div>
            </div>

            <div className={styles.formGrid}>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <CustomInput
                    ref={ref}
                    label="Full Name"
                    value={value}
                    onChange={(val) => onChange(val)}
                    onBlur={onBlur}
                    placeholder="Enter your full name"
                    maxLength={FIELD_LIMITS.NAME}
                    pattern={VALIDATE_PATTERN.alphaNumericSpecialWithSpace}
                    error={error?.message}
                    disabled={isSaving}
                  />
                )}
              />

              <Controller
                name="phone_number"
                control={control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
                  <CustomInput
                    ref={ref}
                    type="tel"
                    label="Phone Number"
                    value={value}
                    onChange={(val) => onChange(val)}
                    onBlur={onBlur}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={FIELD_LIMITS.PHONE}
                    pattern={VALIDATE_PATTERN.number}
                    error={error?.message}
                    disabled={isSaving}
                  />
                )}
              />

              <div className={styles.inputGroup}>
                <label className={styles.label}>GENDER</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value || ""}
                      placeholder="Select Gender"
                      options={GENDER_OPTIONS.map((opt) => ({
                        id: opt.value,
                        label: opt.label,
                      }))}
                      onChange={(selectedVal) => onChange(selectedVal)}
                      rounded="sm"
                      buttonSize="md"
                      align="left"
                    />
                  )}
                />
                {errors.gender && (
                  <span className={styles.errorText}>{errors.gender.message}</span>
                )}
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className={styles.cancelBtn}
                disabled={isSaving}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={!isDirty || isSaving || isUploading}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon fontSize="small" />
                    <span>SAVE CHANGES</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Box>
  );
}
