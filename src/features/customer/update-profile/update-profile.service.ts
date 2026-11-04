import axios from "axios";
import { axiosInstance } from "../../../config/axios";

export interface PresignedUrlItem {
  filename?: string;
  filetype: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  filename?: string;
  filetype: string;
  category: "image" | "document";
  resource_type: "image" | "raw";
  upload_url: string;
  params: {
    api_key: string;
    timestamp: number;
    signature: string;
    folder: string;
    upload_preset: string;
    allowed_formats: string;
    max_file_size: number;
    allowed_types: string[];
  };
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export const getCustomerPresignedUrls = async (
  files: PresignedUrlItem[]
): Promise<PresignedUrlResponse[]> => {
  const res = await axiosInstance.post("/customers/upload/presigned-url", {
    files,
  });
  return res.data?.data || [];
};

export const uploadCustomerProfileImage = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const presignedList = await getCustomerPresignedUrls([
    {
      filename: file.name,
      filetype: file.type,
      folder: "customer-profiles",
    },
  ]);

  const presigned = presignedList[0];
  if (!presigned || !presigned.upload_url) {
    throw new Error("Failed to generate upload URL for profile image");
  }

  if (file.size > presigned.params.max_file_size) {
    const maxMb = Math.round(presigned.params.max_file_size / (1024 * 1024));
    throw new Error(`File is too large. Maximum size allowed is ${maxMb}MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", presigned.params.api_key);
  formData.append("timestamp", presigned.params.timestamp.toString());
  formData.append("signature", presigned.params.signature);
  formData.append("folder", presigned.params.folder);
  if (presigned.params.allowed_formats) {
    formData.append("allowed_formats", presigned.params.allowed_formats);
  }
  formData.append("upload_preset", presigned.params.upload_preset);

  const response = await axios.post(presigned.upload_url, formData);
  return {
    url: response.data.secure_url || response.data.url,
    secure_url: response.data.secure_url,
    public_id: response.data.public_id,
    format: response.data.format,
    bytes: response.data.bytes,
  };
};

export interface UpdateCustomerProfilePayload {
  name?: string;
  phone_number?: string | null;
  gender?: string | null;
  profile_image?: string | null;
}

export const updateCustomerProfileService = async (
  payload: UpdateCustomerProfilePayload
) => {
  const response = await axiosInstance.patch("/customers/profile", payload);
  return response.data;
};
