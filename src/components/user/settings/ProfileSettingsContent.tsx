"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";

import useUserStore from "@/store/user.store";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { handleNumericKeyDown, handleNumericPaste } from "@/utils/utilityFunctions";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

import ChangeEmailModal from "@/components/modals/settings/ChangeEmailModal";
import VerifyEmailModal from "@/components/modals/settings/VerifyEmailModal";
import ChangePhoneInfoModal from "@/components/modals/settings/ChangePhoneInfoModal";
import ChangePhoneEnterModal from "@/components/modals/settings/ChangePhoneEnterModal";
import VerifyPhoneModal from "@/components/modals/settings/VerifyPhoneModal";
import UpdateUsernameModal from "@/components/modals/settings/UpdateUsernameModal";
import UpdateAddressModal from "@/components/modals/settings/UpdateAddressModal";
import ChangeTransactionPinModal from "@/components/modals/settings/ChangeTransactionPinModal";
import ForgotTransactionPinModal from "@/components/modals/settings/ForgotTransactionPinModal";
import ChangePasswordModal from "@/components/modals/settings/ChangePasswordModal";
import ChangePasscodeModal from "@/components/modals/settings/ChangePasscodeModal";
import SetSecurityQuestionsModal from "@/components/modals/settings/SetSecurityQuestionsModal";
import LinkedAccountsModal from "@/components/modals/settings/LinkedAccountsModal";
import DeleteAccountModal from "@/components/modals/settings/DeleteAccountModal";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";

import SecurityPrivacyTab from "@/components/user/settings/tabs/SecurityPrivacyTab";
import PreferencesTab from "@/components/user/settings/tabs/PreferencesTab";

import { useUpdateUser, useUploadDocument } from "@/api/user/user.queries";
import { CURRENCY } from "@/constants/types";
import usePaymentSettingsStore from "@/store/paymentSettings.store";
import { isFingerprintPaymentAvailable } from "@/services/fingerprintPayment.service";
import { FiEdit2, FiChevronRight } from "react-icons/fi";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import Image from "next/image";
import { BsCamera } from "react-icons/bs";
import { FiUpload, FiTrash2 } from "react-icons/fi";

// Countries list with ISO codes
const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "EG", name: "Egypt" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "UY", name: "Uruguay" },
  { code: "PY", name: "Paraguay" },
  { code: "BO", name: "Bolivia" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "NI", name: "Nicaragua" },
  { code: "SV", name: "El Salvador" },
  { code: "DO", name: "Dominican Republic" },
  { code: "CU", name: "Cuba" },
  { code: "JM", name: "Jamaica" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "BB", name: "Barbados" },
  { code: "BS", name: "Bahamas" },
].sort((a, b) => a.name.localeCompare(b.name));

// Employment Status Options
const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
  { value: "homemaker", label: "Homemaker" },
  { value: "other", label: "Other" },
];

// Primary Purpose Options
const PRIMARY_PURPOSE_OPTIONS = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "investment", label: "Investment" },
  { value: "savings", label: "Savings" },
  { value: "trading", label: "Trading" },
  { value: "remittance", label: "Remittance" },
  { value: "other", label: "Other" },
];

// Source of Funds Options
const SOURCE_OF_FUNDS_OPTIONS = [
  { value: "salary", label: "Salary" },
  { value: "business_income", label: "Business Income" },
  { value: "investment_returns", label: "Investment Returns" },
  { value: "savings", label: "Savings" },
  { value: "gift", label: "Gift" },
  { value: "inheritance", label: "Inheritance" },
  { value: "loan", label: "Loan" },
  { value: "other", label: "Other" },
];

const schema = yup.object().shape({
  email: yup.string().email("Email format is not valid").required("Email is required"),
  username: yup.string().required("Username is required"),
  fullname: yup.string().required("Full Name is required"),
  businessName: yup.string().optional(),
  phoneNumber: yup.string().optional(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  referralCode: yup.string().optional(),
  accountTier: yup.string().optional(),
  accountNumber: yup.string().optional(),
  // KYC Fields
  name_first: yup.string().optional(),
  name_last: yup.string().optional(),
  name_other: yup.string().optional(),
  id_number: yup.string().optional(),
  id_country: yup.string().optional(),
  bank_id_number: yup.string().optional(),
  // Address fields
  address: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  postalCode: yup.string().optional(),
  // Background information
  employmentStatus: yup.string().optional(),
  occupation: yup.string().optional(),
  primaryPurpose: yup.string().optional(),
  sourceOfFunds: yup.string().optional(),
  expectedMonthlyInflow: yup.number().optional(),
});

type UserFormData = yup.InferType<typeof schema>;

const ProfileSettingsContent = () => {
  const { user } = useUserStore();
  const [tab, setTab] = useState<"personal" | "security" | "preferences" | "kyc">("personal");

  // personal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgUrl, setImgUrl] = useState(user?.profileImageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addressDisplay, setAddressDisplay] = useState<string>((user as any)?.address || "");

  // modals
  const [openChangeEmail, setOpenChangeEmail] = useState(false);
  const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const [openChangePhone, setOpenChangePhone] = useState(false);
  const [openEnterPhone, setOpenEnterPhone] = useState(false);
  const [openVerifyPhone, setOpenVerifyPhone] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>("");

  const [openUpdateUsername, setOpenUpdateUsername] = useState(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState(false);

  const [openChangePin, setOpenChangePin] = useState(false);
  const [openForgotPin, setOpenForgotPin] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangePasscode, setOpenChangePasscode] = useState(false);
  const [openSetSecurity, setOpenSetSecurity] = useState(false);
  const [openLinked, setOpenLinked] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // fingerprint
  const [openVerifyPinForFingerprint, setOpenVerifyPinForFingerprint] = useState(false);
  const [pendingFingerprintEnable, setPendingFingerprintEnable] = useState(false);
  const { fingerprintPaymentEnabled, setFingerprintPaymentEnabled } = usePaymentSettingsStore();
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);

  // KYC Document Upload
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    "passport" | "bank_statement" | "utility_bill" | "drivers_license" | "national_id"
  >("passport"); // default display: International Passport
  const [hasUserChangedDocumentType, setHasUserChangedDocumentType] = useState(false);
  const [documentTypeDropdownOpen, setDocumentTypeDropdownOpen] = useState(false);
  const documentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentCountry, setDocumentCountry] = useState("");
  const [documentCountryDropdownOpen, setDocumentCountryDropdownOpen] = useState(false);
  const documentCountryDropdownRef = useRef<HTMLDivElement>(null);
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const issueDatePickerRef = useRef<HTMLDivElement>(null);
  const expiryDatePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);
  
  // Personal tab dropdowns
  const [employmentStatusDropdownOpen, setEmploymentStatusDropdownOpen] = useState(false);
  const employmentStatusDropdownRef = useRef<HTMLDivElement>(null);
  const [primaryPurposeDropdownOpen, setPrimaryPurposeDropdownOpen] = useState(false);
  const primaryPurposeDropdownRef = useRef<HTMLDivElement>(null);
  const [sourceOfFundsDropdownOpen, setSourceOfFundsDropdownOpen] = useState(false);
  const sourceOfFundsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isFingerprintPaymentAvailable().then(setIsFingerprintAvailable);
  }, []);

  useOnClickOutside(datePickerRef as React.RefObject<HTMLElement>, () => setShowDatePicker(false));
  useOnClickOutside(documentTypeDropdownRef as React.RefObject<HTMLElement>, () => setDocumentTypeDropdownOpen(false));
  useOnClickOutside(documentCountryDropdownRef as React.RefObject<HTMLElement>, () => setDocumentCountryDropdownOpen(false));
  useOnClickOutside(issueDatePickerRef as React.RefObject<HTMLElement>, () => setShowIssueDatePicker(false));
  useOnClickOutside(expiryDatePickerRef as React.RefObject<HTMLElement>, () => setShowExpiryDatePicker(false));
  useOnClickOutside(employmentStatusDropdownRef as React.RefObject<HTMLElement>, () => setEmploymentStatusDropdownOpen(false));
  useOnClickOutside(primaryPurposeDropdownRef as React.RefObject<HTMLElement>, () => setPrimaryPurposeDropdownOpen(false));
  useOnClickOutside(sourceOfFundsDropdownRef as React.RefObject<HTMLElement>, () => setSourceOfFundsDropdownOpen(false));

  const accountNumber = user?.wallet?.find((w) => w.currency === CURRENCY.NGN)?.accountNumber;
  const isBusinessAccount = user?.accountType === "BUSINESS" || user?.isBusiness === true;

  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email,
      username: user?.username,
      fullname: user?.fullname,
      businessName: user?.businessName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth || "",
      referralCode: user?.referralCode || "",
      accountTier: `Tier ${user?.tierLevel}` || "",
      accountNumber: accountNumber || "",
      // KYC Fields
      name_first: (user as any)?.name_first || "",
      name_last: (user as any)?.name_last || "",
      name_other: (user as any)?.name_other || "",
      id_number: (user as any)?.id_number || "",
      id_country: (user as any)?.id_country || "",
      bank_id_number: (user as any)?.bank_id_number || "",
      // Address fields
      address: (user as any)?.address || "",
      city: (user as any)?.city || "",
      state: (user as any)?.state || "",
      postalCode: (user as any)?.postalCode || "",
      // Background information
      employmentStatus: (user as any)?.employmentStatus || (user as any)?.background_information?.employment_status || "",
      occupation: (user as any)?.occupation || (user as any)?.background_information?.occupation || "",
      primaryPurpose: (user as any)?.primaryPurpose || (user as any)?.background_information?.primary_purpose || "",
      sourceOfFunds: (user as any)?.sourceOfFunds || (user as any)?.background_information?.source_of_funds || "",
      expectedMonthlyInflow: (user as any)?.expectedMonthlyInflow || (user as any)?.background_information?.expected_monthly_inflow || 0,
    } as any,
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const { register, handleSubmit, formState, watch, setValue, clearErrors } = form;
  const { errors, isValid } = formState;
  const watchedDateOfBirth = watch("dateOfBirth");

  useEffect(() => {
    if (user?.profileImageUrl) setImgUrl(user.profileImageUrl);
  }, [user?.profileImageUrl]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("en-US", { month: "short" });
    const year = newDate.getFullYear();
    setValue("dateOfBirth", `${day}-${month}-${year}`);
    setShowDatePicker(false);
  };

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
    ErrorToast({ title: "Error updating profile", descriptions });
  };

  const onSuccess = () => {
    SuccessToast({ title: "Update successful!", description: "Profile updated successfully" });
  };

  const { mutate: update, isPending: updatePending, isError: updateError } = useUpdateUser(onError, onSuccess);
  const updateLoading = updatePending && !updateError;

  // Update passport identity fields after document upload (required for USD account creation)
  const onKycIdentityUpdateError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to save passport details"];
    ErrorToast({ title: "KYC Update Failed", descriptions });
  };
  const onKycIdentityUpdateSuccess = () => {
    SuccessToast({ title: "KYC Updated", description: "Passport details saved successfully" });
  };
  const { mutate: updateKycIdentity } = useUpdateUser(onKycIdentityUpdateError, onKycIdentityUpdateSuccess);

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB <= 500) {
          const imageUrl = URL.createObjectURL(file);
          setImgUrl(imageUrl);
          setSelectedFile(file);
        } else {
          toast.error("Selected file size exceeds the limit (500KB).", { duration: 3000 });
        }
      } else {
        toast.error("Unsupported image format (JPEG, JPG, PNG, WebP).", { duration: 3000 });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();
    formData.append("fullName", data.fullname);
    formData.append("phoneNumber", data.phoneNumber || "");
    if (isBusinessAccount && data.businessName) formData.append("businessName", data.businessName);
    if (data.address) formData.append("address", data.address);
    if (data.city) formData.append("city", data.city);
    if (data.state) formData.append("state", data.state);
    if (data.postalCode) formData.append("postalCode", data.postalCode);
    if (data.employmentStatus) formData.append("employmentStatus", data.employmentStatus);
    if (data.occupation) formData.append("occupation", data.occupation);
    if (data.primaryPurpose) formData.append("primaryPurpose", data.primaryPurpose);
    if (data.sourceOfFunds) formData.append("sourceOfFunds", data.sourceOfFunds);
    if (data.expectedMonthlyInflow) formData.append("expectedMonthlyInflow", data.expectedMonthlyInflow.toString());
    if (selectedFile) formData.append("profile-image", selectedFile);
    update(formData);
  };

  // Upload document handlers
  const onUploadDocumentError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to upload document"];
    ErrorToast({ title: "Upload Failed", descriptions });
  };

  const onUploadDocumentSuccess = (responseData: any) => {
    // Normalize multiple backend response shapes:
    // - Legacy: { documentType, documentUrl, documentCountry, issueDate, expiryDate, documentNumber }
    // - New: { url, type, country, issue_date, expiry_date, documentNumber, uploaded_at }
    const raw = responseData?.data?.data ?? null;
    const doc =
      raw?.documentType
        ? raw
        : raw?.type || raw?.url
          ? raw
          : Array.isArray(raw?.kycDocuments)
            ? raw.kycDocuments?.[0]
            : Array.isArray(raw)
              ? raw?.[0]
              : null;

    const normalizeDocType = (t: any) => {
      const v = String(t || "").toLowerCase();
      if (v === "passport") return "passport";
      if (v === "bank_statement") return "bank_statement";
      if (v === "utility_bill") return "utility_bill";
      if (v === "drivers_license") return "drivers_license";
      if (v === "national_id") return "national_id";
      return "";
    };

    if (doc) {
      const normalizedType = normalizeDocType(doc.documentType || doc.type || selectedDocumentType);
      const normalizedUrl = String(doc.documentUrl || doc.url || "").trim();
      const normalizedCountry = String(doc.documentCountry || doc.country || "").trim();
      const normalizedIssue = normalizeDate(String(doc.issueDate || doc.issue_date || ""));
      const normalizedExpiry = normalizeDate(String(doc.expiryDate || doc.expiry_date || ""));
      const normalizedNumber = String(doc.documentNumber || doc.document_number || "").trim();

      // Update local user store so UI reflects immediately, even before refetch
      const { setUser } = useUserStore.getState();
      const updatedUser: any = { ...user };
      const nextKycDoc = {
        url: normalizedUrl || undefined,
        type: normalizedType || undefined,
        country: normalizedCountry || undefined,
        issue_date: normalizedIssue || undefined,
        expiry_date: normalizedExpiry || undefined,
        uploaded_at: doc.uploaded_at || new Date().toISOString(),
        documentNumber: normalizedNumber || undefined,
      };
      if (nextKycDoc.url && nextKycDoc.type) {
        const existing = Array.isArray(updatedUser.kycDocuments) ? updatedUser.kycDocuments : [];
        updatedUser.kycDocuments = [nextKycDoc, ...existing];
        setUser(updatedUser);
      }

      // Keep the saved document information visible after upload (form state)
      if (normalizedType) {
        setHasUserChangedDocumentType(true);
        setSelectedDocumentType(normalizedType as any);
        setDocumentNumber(normalizedNumber || "");
        setDocumentCountry(normalizedCountry || "");
        setIssueDate(normalizedIssue || "");
        setExpiryDate(normalizedExpiry || "");
      }

      // IMPORTANT: also persist passport identity fields on the user profile (backend requires these for USD account creation)
      if (
        normalizedType === "passport" &&
        normalizedNumber &&
        normalizedCountry &&
        normalizedIssue &&
        normalizedExpiry
      ) {
        const fd = new FormData();
        fd.append("passportNumber", normalizedNumber);
        fd.append("passportCountry", normalizedCountry);
        fd.append("passportIssueDate", normalizedIssue);
        fd.append("passportExpiryDate", normalizedExpiry);
        updateKycIdentity(fd);

        // Optimistically update local user store so UI reflects immediately
        const { setUser } = useUserStore.getState();
        setUser({
          ...(user as any),
          passportNumber: normalizedNumber,
          passportCountry: normalizedCountry,
          passportIssueDate: normalizedIssue,
          passportExpiryDate: normalizedExpiry,
        });
      }
    }
    SuccessToast({
      title: "Document Uploaded!",
      description: responseData?.data?.message || "Your document has been uploaded successfully",
    });
    
    // Clear only the file input after successful upload
    setSelectedDocumentFile(null);
    if (documentFileInputRef.current) documentFileInputRef.current.value = "";
  };

  const { mutate: uploadDocument, isPending: uploadDocumentPending } = useUploadDocument(
    onUploadDocumentError,
    onUploadDocumentSuccess
  );

  // Helper function to normalize date to YYYY-MM-DD format
  const normalizeDate = (date: string): string => {
    if (!date) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  type SavedKycDocument = {
    documentType:
      | "passport"
      | "bank_statement"
      | "utility_bill"
      | "drivers_license"
      | "national_id";
    documentUrl?: string;
    documentNumber?: string;
    documentCountry?: string;
    issueDate?: string;
    expiryDate?: string;
  };

  const savedKycDocument: SavedKycDocument | null = useMemo(() => {
    const u: any = user;
    if (!u) return null;

    // New API shape: array of uploaded docs
    if (Array.isArray(u.kycDocuments) && u.kycDocuments.length > 0) {
      const docs = u.kycDocuments as any[];
      const sorted = [...docs].sort((a, b) => {
        const ad = new Date(a?.uploaded_at || a?.uploadedAt || a?.createdAt || 0).getTime();
        const bd = new Date(b?.uploaded_at || b?.uploadedAt || b?.createdAt || 0).getTime();
        return bd - ad;
      });
      const d = sorted[0] || null;
      if (d?.url && d?.type) {
        return {
          documentType: String(d.type) as any,
          documentUrl: String(d.url),
          documentNumber: d?.documentNumber ? String(d.documentNumber) : undefined,
          documentCountry: d?.country ? String(d.country) : undefined,
          issueDate: d?.issue_date ? String(d.issue_date) : undefined,
          expiryDate: d?.expiry_date ? String(d.expiry_date) : undefined,
        };
      }
    }

    // Legacy fields (older backend versions)
    if (u.passportDocumentUrl) {
      return {
        documentType: "passport",
        documentUrl: u.passportDocumentUrl,
        documentNumber: u.passportNumber,
        documentCountry: u.passportCountry,
        issueDate: u.passportIssueDate,
        expiryDate: u.passportExpiryDate,
      };
    }
    if (u.driversLicenseUrl) {
      return {
        documentType: "drivers_license",
        documentUrl: u.driversLicenseUrl,
        documentNumber: u.driversLicenseNumber,
        documentCountry: u.driversLicenseCountry,
      };
    }
    if (u.nationalIdUrl) {
      return {
        documentType: "national_id",
        documentUrl: u.nationalIdUrl,
        documentNumber: u.nationalIdNumber,
        documentCountry: u.nationalIdCountry,
      };
    }
    if (u.bankStatementUrl) {
      return {
        documentType: "bank_statement",
        documentUrl: u.bankStatementUrl,
        issueDate: u.bankStatementIssueDate,
        expiryDate: u.bankStatementExpiryDate,
      };
    }
    if (u.utilityBillUrl) {
      return {
        documentType: "utility_bill",
        documentUrl: u.utilityBillUrl,
        issueDate: u.utilityBillIssueDate,
        expiryDate: u.utilityBillExpiryDate,
      };
    }
    return null;
  }, [user]);

  // Hydrate KYC upload form from already saved document (so "Select Document Type" shows what user uploaded)
  useEffect(() => {
    if (tab !== "kyc") return;
    if (!savedKycDocument) return;
    if (hasUserChangedDocumentType) return; // user is actively selecting/editing
    if (selectedDocumentFile) return; // don't override mid-upload

    setSelectedDocumentType(savedKycDocument.documentType);
    setDocumentNumber(savedKycDocument.documentNumber || "");
    setDocumentCountry(savedKycDocument.documentCountry || "");
    setIssueDate(normalizeDate(savedKycDocument.issueDate || ""));
    setExpiryDate(normalizeDate(savedKycDocument.expiryDate || ""));
  }, [tab, savedKycDocument, hasUserChangedDocumentType, selectedDocumentFile]);

  // Handle document upload
  const handleDocumentUpload = () => {
    if (!selectedDocumentType) {
      ErrorToast({
        title: "Document Type Required",
        descriptions: ["Please select a document type to continue"],
      });
      return;
    }
    if (!selectedDocumentFile) {
      ErrorToast({
        title: "No File Selected",
        descriptions: ["Please select a file to upload"],
      });
      return;
    }

    // Validate required fields for passport, drivers_license, national_id
    if (selectedDocumentType === "passport" || selectedDocumentType === "drivers_license" || selectedDocumentType === "national_id") {
      if (!documentNumber || !documentCountry) {
        ErrorToast({
          title: "Missing Information",
          descriptions: ["Please provide document number and country"],
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("documentType", selectedDocumentType);
    formData.append("document", selectedDocumentFile);

    // Add required fields for passport, drivers_license, national_id
    if (selectedDocumentType === "passport" || selectedDocumentType === "drivers_license" || selectedDocumentType === "national_id") {
      formData.append("documentNumber", documentNumber);
      formData.append("documentCountry", documentCountry);
    }

    // Add optional dates if provided
    if (issueDate) {
      formData.append("issueDate", issueDate);
    }
    if (expiryDate) {
      formData.append("expiryDate", expiryDate);
    }

    uploadDocument(formData);
  };

  const currentPhone = user?.phoneNumber || "";

  return (
    <>
      <div className="flex flex-col gap-6 pb-10 px-3 sm:px-0">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Profile & Settings</h1>
            <p className="text-white/60 text-sm mt-1">Manage your personal information and preferences</p>
          </div>

          {/* Tabs (match Payments page sizing) */}
          <div className="w-full">
            <div className="flex items-center gap-2 p-1 rounded-full border border-gray-800 bg-[#1C1C1E] w-full overflow-hidden">
              {[
                { key: "personal", label: "Personal" },
                { key: "kyc", label: "KYC Information" },
                { key: "security", label: "Security & Privacy" },
                { key: "preferences", label: "Preferences" },
              ].map((t: any) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  type="button"
                  className={`flex-1 min-w-0 text-[10px] xs:text-[11px] sm:text-xs px-2.5 xs:px-3 sm:px-4 py-2 rounded-full whitespace-nowrap truncate leading-none transition-colors ${
                    tab === t.key ? "bg-[#2C2C2E] text-white" : "text-gray-300 hover:bg-[#1C1C1E]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "personal" ? (
            <>
              <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white/5">
                    {imgUrl ? (
                      <Image src={imgUrl} alt="profile" fill className="object-cover" />
                    ) : (
                      <div className="uppercase w-full h-full flex justify-center items-center text-text-200 dark:text-text-400 text-2xl sm:text-3xl">
                        {user?.fullname?.slice(0, 2)}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-[#FF6B2C] text-white text-base shadow"
                      title="Upload photo"
                    >
                      <BsCamera />
                    </button>
                    <input type="file" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileSelected} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-white font-semibold text-base sm:text-lg">
                      {isBusinessAccount && user?.businessName ? user.businessName : user?.fullname}
                    </p>
                    <p className="text-white/70 text-sm">{user?.email}</p>
                    {isBusinessAccount && user?.businessName && (
                      <p className="text-white/60 text-xs mt-1">Representative: {user?.fullname}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFileUpload}
                        className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm inline-flex items-center gap-2"
                      >
                        <FiUpload className="text-base" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImgUrl(""); setSelectedFile(null); }}
                        className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-sm inline-flex items-center gap-2"
                      >
                        <FiTrash2 className="text-base" />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8">
                <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {isBusinessAccount ? (
                      <>
                        <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                          <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                            Business Name
                          </label>
                          <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                            <input
                              className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                              placeholder="Business name"
                              type="text"
                              {...register("businessName")}
                            />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                              <FiEdit2 className="text-xs" />
                            </button>
                          </div>
                          {errors?.businessName?.message ? (
                            <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                              {errors?.businessName?.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                          <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                            Representative Name
                          </label>
                          <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                            <input
                              className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                              placeholder="Representative name"
                              type="text"
                              {...register("fullname")}
                            />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                              <FiEdit2 className="text-xs" />
                            </button>
                          </div>
                          {errors?.fullname?.message ? (
                            <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                              {errors?.fullname?.message}
                            </p>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Full Name
                        </label>
                        <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                          <input
                            className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                            placeholder="Full name"
                            type="text"
                            {...register("fullname")}
                          />
                          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                            <FiEdit2 className="text-xs" />
                          </button>
                        </div>
                        {errors?.fullname?.message ? (
                          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                            {errors?.fullname?.message}
                          </p>
                        ) : null}
                      </div>
                    )}

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Nickname
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Username"
                          disabled
                          type="text"
                          {...register("username")}
                        />
                        <button type="button" onClick={() => setOpenUpdateUsername(true)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.username?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.username?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Email address
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Email"
                          disabled
                          type="email"
                          {...register("email")}
                        />
                        <button type="button" onClick={() => setOpenChangeEmail(true)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.email?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.email?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Mobile Number
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Phone Number"
                          disabled
                          type="text"
                          {...register("phoneNumber")}
                          onKeyDown={handleNumericKeyDown}
                          onPaste={handleNumericPaste}
                        />
                        <button type="button" onClick={() => setOpenChangePhone(true)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.phoneNumber?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.phoneNumber?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="w-full relative">
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Date Of Birth
                        </label>
                        <div
                          onClick={() => setShowDatePicker((v) => !v)}
                          className="cursor-pointer w-full flex gap-2 justify-center items-center bg-bg-2000 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3"
                        >
                          {watchedDateOfBirth ? (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-700 dark:placeholder:text-text-1000 placeholder:text-sm">
                              {watchedDateOfBirth}
                            </div>
                          ) : (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-700 dark:placeholder:text-text-1000 placeholder:text-sm">
                              Select Date of Birth
                            </div>
                          )}
                        </div>
                        {errors.dateOfBirth?.message ? (
                          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                            {errors.dateOfBirth?.message}
                          </p>
                        ) : null}
                      </div>
                      {showDatePicker && (
                        <div ref={datePickerRef} className="absolute z-10 mt-1">
                          <DatePicker
                            selected={watchedDateOfBirth ? new Date(watchedDateOfBirth) : null}
                            onChange={handleDateChange}
                            inline
                            calendarClassName="custom-calendar"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Referral Code
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Referral Code"
                          disabled
                          type="text"
                          {...register("referralCode")}
                        />
                      </div>
                      {errors?.referralCode?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.referralCode?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Account Type
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Account type"
                          disabled
                          type="text"
                          {...register("accountTier")}
                        />
                      </div>
                      {errors?.accountTier?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.accountTier?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Account Number
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Account number"
                          disabled
                          type="text"
                          {...register("accountNumber")}
                        />
                      </div>
                      {errors?.accountNumber?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.accountNumber?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2 flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Address
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter your address"
                          type="text"
                          {...register("address")}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.address?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.address?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* City */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        City
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter your city"
                          type="text"
                          {...register("city")}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.city?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.city?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* State */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        State
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter your state"
                          type="text"
                          {...register("state")}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.state?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.state?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Postal Code */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Postal Code
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter your postal code"
                          type="text"
                          {...register("postalCode")}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.postalCode?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.postalCode?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Employment Status */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Employment Status
                      </label>
                      <div ref={employmentStatusDropdownRef} className="relative w-full">
                        <button
                          type="button"
                          onClick={() => setEmploymentStatusDropdownOpen(!employmentStatusDropdownOpen)}
                          className="w-full flex gap-2 justify-between items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3 text-left"
                        >
                          <span className={`text-base ${watch("employmentStatus") ? "text-text-200 dark:text-white" : "text-text-200 dark:text-text-1000"}`}>
                            {watch("employmentStatus") 
                              ? EMPLOYMENT_STATUS_OPTIONS.find(s => s.value === watch("employmentStatus"))?.label || watch("employmentStatus")
                              : "Select employment status"}
                          </span>
                          <FiChevronRight className={`text-text-200 dark:text-text-400 transition-transform ${employmentStatusDropdownOpen ? "rotate-90" : ""}`} />
                        </button>
                        {employmentStatusDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                            {EMPLOYMENT_STATUS_OPTIONS.map((status) => (
                              <div
                                key={status.value}
                                onClick={() => {
                                  setValue("employmentStatus", status.value);
                                  clearErrors("employmentStatus");
                                  setEmploymentStatusDropdownOpen(false);
                                }}
                                className="hover:opacity-80 w-full flex items-center justify-between px-4 py-2 gap-2 cursor-pointer"
                              >
                                <span className="w-full text-sm text-text-200 dark:text-text-400">{status.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors?.employmentStatus?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.employmentStatus?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Occupation */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Occupation
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter your occupation (e.g., Software Engineer)"
                          type="text"
                          {...register("occupation")}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.occupation?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.occupation?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Primary Purpose */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Primary Purpose
                      </label>
                      <div ref={primaryPurposeDropdownRef} className="relative w-full">
                        <button
                          type="button"
                          onClick={() => setPrimaryPurposeDropdownOpen(!primaryPurposeDropdownOpen)}
                          className="w-full flex gap-2 justify-between items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3 text-left"
                        >
                          <span className={`text-base ${watch("primaryPurpose") ? "text-text-200 dark:text-white" : "text-text-200 dark:text-text-1000"}`}>
                            {watch("primaryPurpose") 
                              ? PRIMARY_PURPOSE_OPTIONS.find(p => p.value === watch("primaryPurpose"))?.label || watch("primaryPurpose")
                              : "Select primary purpose"}
                          </span>
                          <FiChevronRight className={`text-text-200 dark:text-text-400 transition-transform ${primaryPurposeDropdownOpen ? "rotate-90" : ""}`} />
                        </button>
                        {primaryPurposeDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                            {PRIMARY_PURPOSE_OPTIONS.map((purpose) => (
                              <div
                                key={purpose.value}
                                onClick={() => {
                                  setValue("primaryPurpose", purpose.value);
                                  clearErrors("primaryPurpose");
                                  setPrimaryPurposeDropdownOpen(false);
                                }}
                                className="hover:opacity-80 w-full flex items-center justify-between px-4 py-2 gap-2 cursor-pointer"
                              >
                                <span className="w-full text-sm text-text-200 dark:text-text-400">{purpose.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors?.primaryPurpose?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.primaryPurpose?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Source of Funds */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Source of Funds
                      </label>
                      <div ref={sourceOfFundsDropdownRef} className="relative w-full">
                        <button
                          type="button"
                          onClick={() => setSourceOfFundsDropdownOpen(!sourceOfFundsDropdownOpen)}
                          className="w-full flex gap-2 justify-between items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3 text-left"
                        >
                          <span className={`text-base ${watch("sourceOfFunds") ? "text-text-200 dark:text-white" : "text-text-200 dark:text-text-1000"}`}>
                            {watch("sourceOfFunds") 
                              ? SOURCE_OF_FUNDS_OPTIONS.find(s => s.value === watch("sourceOfFunds"))?.label || watch("sourceOfFunds")
                              : "Select source of funds"}
                          </span>
                          <FiChevronRight className={`text-text-200 dark:text-text-400 transition-transform ${sourceOfFundsDropdownOpen ? "rotate-90" : ""}`} />
                        </button>
                        {sourceOfFundsDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                            {SOURCE_OF_FUNDS_OPTIONS.map((source) => (
                              <div
                                key={source.value}
                                onClick={() => {
                                  setValue("sourceOfFunds", source.value);
                                  clearErrors("sourceOfFunds");
                                  setSourceOfFundsDropdownOpen(false);
                                }}
                                className="hover:opacity-80 w-full flex items-center justify-between px-4 py-2 gap-2 cursor-pointer"
                              >
                                <span className="w-full text-sm text-text-200 dark:text-text-400">{source.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors?.sourceOfFunds?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.sourceOfFunds?.message}
                        </p>
                      ) : null}
                    </div>

                    {/* Expected Monthly Inflow */}
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Expected Monthly Inflow
                      </label>
                      <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter expected monthly inflow (e.g., 5000)"
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("expectedMonthlyInflow")}
                          onKeyDown={handleNumericKeyDown}
                          onPaste={handleNumericPaste}
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                          <FiEdit2 className="text-xs" />
                        </button>
                      </div>
                      {errors?.expectedMonthlyInflow?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.expectedMonthlyInflow?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <CustomButton
                    type="submit"
                    disabled={!isValid || updateLoading}
                    isLoading={updateLoading}
                    className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black font-semibold text-base sm:text-lg py-3 rounded-xl"
                  >
                    Save
                  </CustomButton>
                </div>
              </form>
            </>
          ) : null}

          {tab === "kyc" ? (
            <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">Upload KYC Document</h3>
                <p className="text-white/60 text-sm">Upload documents required for USD, GBP, or EUR account creation. Accepts JPG, PNG, or PDF.</p>
              </div>

              {/* Saved document summary (so data shows on view/reopen) */}
              {savedKycDocument && (
                <div className="mb-6 rounded-xl border border-white/10 bg-[#1C1C1E] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-semibold">
                        Saved Document:{" "}
                        {savedKycDocument.documentType === "passport"
                          ? "International Passport"
                          : savedKycDocument.documentType === "bank_statement"
                          ? "Bank Statement"
                          : savedKycDocument.documentType === "utility_bill"
                          ? "Utility Bill"
                          : savedKycDocument.documentType === "drivers_license"
                          ? "Driver's License"
                          : "National ID"}
                      </p>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/70">
                        {savedKycDocument.documentNumber ? (
                          <p className="truncate">Document No: {savedKycDocument.documentNumber}</p>
                        ) : null}
                        {savedKycDocument.documentCountry ? (
                          <p className="truncate">
                            Country:{" "}
                            {COUNTRIES.find((c) => c.code === savedKycDocument.documentCountry)?.name ||
                              savedKycDocument.documentCountry}
                          </p>
                        ) : null}
                        {savedKycDocument.issueDate ? <p>Issue Date: {normalizeDate(savedKycDocument.issueDate)}</p> : null}
                        {savedKycDocument.expiryDate ? <p>Expiry Date: {normalizeDate(savedKycDocument.expiryDate)}</p> : null}
                      </div>
                    </div>

                    {savedKycDocument.documentUrl ? (
                      <a
                        href={savedKycDocument.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 hover:bg-[#FF6B2C]/25 transition-colors"
                      >
                        View
                      </a>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Document Type Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Select Document Type <span className="text-red-500 ml-1">*</span>
                </label>
                <div ref={documentTypeDropdownRef} className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setDocumentTypeDropdownOpen(!documentTypeDropdownOpen)}
                    className="w-full flex gap-2 justify-between items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3 text-left"
                  >
                    <span className={`text-base ${selectedDocumentType ? "text-text-200 dark:text-white" : "text-text-200 dark:text-text-1000"}`}>
                      {selectedDocumentType === "passport" 
                        ? "International Passport"
                        : selectedDocumentType === "bank_statement"
                        ? "Bank Statement"
                        : selectedDocumentType === "utility_bill"
                        ? "Utility Bill"
                        : selectedDocumentType === "drivers_license"
                        ? "Driver's License"
                        : selectedDocumentType === "national_id"
                        ? "National ID"
                        : "Select document type"}
                    </span>
                    <FiChevronRight className={`text-text-200 dark:text-text-400 transition-transform ${documentTypeDropdownOpen ? "rotate-90" : ""}`} />
                  </button>
                  {documentTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                      {[
                        { value: "passport", label: "International Passport" },
                        { value: "bank_statement", label: "Bank Statement" },
                        { value: "utility_bill", label: "Utility Bill" },
                        { value: "drivers_license", label: "Driver's License" },
                        { value: "national_id", label: "National ID" },
                      ].map((doc) => (
                        <div
                          key={doc.value}
                          onClick={() => {
                            setHasUserChangedDocumentType(true);
                            setSelectedDocumentType(doc.value as any);
                            setDocumentTypeDropdownOpen(false);
                            // Reset form when changing document type
                            setDocumentNumber("");
                            setDocumentCountry("");
                            setIssueDate("");
                            setExpiryDate("");
                            setSelectedDocumentFile(null);
                            if (documentFileInputRef.current) documentFileInputRef.current.value = "";
                          }}
                          className="hover:opacity-80 w-full flex items-center justify-between px-4 py-2 gap-2 cursor-pointer"
                        >
                          <span className="w-full text-sm text-text-200 dark:text-text-400">{doc.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedDocumentType && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDocumentUpload();
                  }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {selectedDocumentType === "passport" ? "International Passport" :
                       selectedDocumentType === "bank_statement" ? "Bank Statement" :
                       selectedDocumentType === "utility_bill" ? "Utility Bill" :
                       selectedDocumentType === "drivers_license" ? "Driver's License" :
                       selectedDocumentType === "national_id" ? "National ID" : ""}
                    </h3>
                    <p className="text-white/60 text-sm">Enter document details and upload the file</p>
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Document Number - Required for passport, drivers_license, national_id */}
                    {(selectedDocumentType === "passport" || selectedDocumentType === "drivers_license" || selectedDocumentType === "national_id") && (
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Document Number <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                          <input
                            className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                            placeholder={selectedDocumentType === "passport" ? "Enter passport number" : selectedDocumentType === "drivers_license" ? "Enter license number" : "Enter ID number"}
                            type="text"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                          />
                          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                            <FiEdit2 className="text-xs" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Document Country - Required for passport, drivers_license, national_id */}
                    {(selectedDocumentType === "passport" || selectedDocumentType === "drivers_license" || selectedDocumentType === "national_id") && (
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Country that Issued Document <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div ref={documentCountryDropdownRef} className="relative w-full">
                          <button
                            type="button"
                            onClick={() => setDocumentCountryDropdownOpen(!documentCountryDropdownOpen)}
                            className="w-full flex gap-2 justify-between items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3 text-left"
                          >
                            <span className={`text-base ${documentCountry ? "text-text-200 dark:text-white" : "text-text-200 dark:text-text-1000"}`}>
                              {documentCountry
                                ? COUNTRIES.find(c => c.code === documentCountry)?.name || documentCountry
                                : "Select country"}
                            </span>
                            <FiChevronRight className={`text-text-200 dark:text-text-400 transition-transform ${documentCountryDropdownOpen ? "rotate-90" : ""}`} />
                          </button>
                          {documentCountryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                              <SearchableDropdown
                                items={COUNTRIES}
                                searchKey="name"
                                displayFormat={(country) => (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-text-200 dark:text-text-400">
                                      {country.name} ({country.code})
                                    </span>
                                  </div>
                                )}
                                onSelect={(country) => {
                                  setDocumentCountry(country.code);
                                  setDocumentCountryDropdownOpen(false);
                                }}
                                showSearch={true}
                                placeholder="Search country..."
                                isOpen={documentCountryDropdownOpen}
                                onClose={() => setDocumentCountryDropdownOpen(false)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Issue Date */}
                    <div className="w-full relative">
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Issue Date
                        </label>
                        <div
                          onClick={() => setShowIssueDatePicker(!showIssueDatePicker)}
                          className="cursor-pointer w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3"
                        >
                          {issueDate ? (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white">
                              {issueDate}
                            </div>
                          ) : (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white/50">
                              Select issue date (YYYY-MM-DD)
                            </div>
                          )}
                        </div>
                      </div>
                      {showIssueDatePicker && (
                        <div ref={issueDatePickerRef} className="absolute z-10 mt-1">
                          <DatePicker
                            selected={issueDate ? new Date(issueDate) : null}
                            onChange={(date: Date | null) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                setIssueDate(`${year}-${month}-${day}`);
                                setShowIssueDatePicker(false);
                              }
                            }}
                            inline
                            calendarClassName="custom-calendar"
                            maxDate={new Date()}
                          />
                        </div>
                      )}
                    </div>

                    {/* Expiry Date */}
                    <div className="w-full relative">
                      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                        <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                          Expiry Date
                        </label>
                        <div
                          onClick={() => setShowExpiryDatePicker(!showExpiryDatePicker)}
                          className="cursor-pointer w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3"
                        >
                          {expiryDate ? (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white">
                              {expiryDate}
                            </div>
                          ) : (
                            <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white/50">
                              Select expiry date (YYYY-MM-DD)
                            </div>
                          )}
                        </div>
                      </div>
                      {showExpiryDatePicker && (
                        <div ref={expiryDatePickerRef} className="absolute z-10 mt-1">
                          <DatePicker
                            selected={expiryDate ? new Date(expiryDate) : null}
                            onChange={(date: Date | null) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                setExpiryDate(`${year}-${month}-${day}`);
                                setShowExpiryDatePicker(false);
                              }
                            }}
                            inline
                            calendarClassName="custom-calendar"
                            minDate={new Date()}
                          />
                        </div>
                      )}
                    </div>

                    {/* File Upload */}
                    <div className="sm:col-span-2 flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start">
                        Document File <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          ref={documentFileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file type
                              const extension = file.name.split(".").pop()?.toLowerCase();
                              if (!extension || !["pdf", "jpg", "jpeg", "png"].includes(extension)) {
                                ErrorToast({
                                  title: "Invalid File Type",
                                  descriptions: ["Please upload a PDF, JPG, or PNG file"],
                                });
                                return;
                              }
                              // Validate file size (max 10MB)
                              const maxSize = 10 * 1024 * 1024; // 10MB
                              if (file.size > maxSize) {
                                ErrorToast({
                                  title: "File Too Large",
                                  descriptions: ["Please upload a file smaller than 10MB"],
                                });
                                return;
                              }
                              setSelectedDocumentFile(file);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => documentFileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 hover:bg-[#FF6B2C]/25 transition-colors"
                        >
                          <FiUpload className="text-base" />
                          <span>
                            {selectedDocumentFile ? selectedDocumentFile.name : "Choose File (PDF, JPG, or PNG)"}
                          </span>
                        </button>
                        {selectedDocumentFile && (
                          <div className="flex items-center gap-2 text-sm text-white/70 mt-2">
                            <span>✓ File selected: {selectedDocumentFile.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDocumentFile(null);
                                if (documentFileInputRef.current) documentFileInputRef.current.value = "";
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <CustomButton
                      type="submit"
                      disabled={uploadDocumentPending || !selectedDocumentFile || (selectedDocumentType === "passport" || selectedDocumentType === "drivers_license" || selectedDocumentType === "national_id" ? (!documentNumber || !documentCountry) : false)}
                      isLoading={uploadDocumentPending}
                      className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black font-semibold text-base sm:text-lg py-3 rounded-xl"
                    >
                      Upload Document
                    </CustomButton>
                  </div>
                </form>
              )}

              {!selectedDocumentType && (
                <div className="text-center py-12">
                  <p className="text-white/60 text-sm">Please select a document type to continue</p>
                </div>
              )}
            </div>
          ) : null}

          {tab === "security" ? (
            <SecurityPrivacyTab
              fingerprint={fingerprintPaymentEnabled}
              biometricEnabled={false}
              biometricType={null}
              biometricDeviceName={null}
              onToggleBiometric={() => {}}
              onToggleFingerprint={() => {
                if (!isFingerprintAvailable) {
                  ErrorToast({
                    title: "Not Available",
                    descriptions: ["Biometric authentication is not available on this device"],
                  });
                  return;
                }
                if (!fingerprintPaymentEnabled) {
                  setPendingFingerprintEnable(true);
                  setOpenVerifyPinForFingerprint(true);
                } else {
                  setFingerprintPaymentEnabled(false);
                  SuccessToast({
                    title: "Fingerprint Payment Disabled",
                    description: "You can still use your PIN for payments",
                  });
                }
              }}
              onOpenChangePin={() => setOpenChangePin(true)}
              onOpenForgotPin={() => setOpenForgotPin(true)}
              onOpenChangePassword={() => setOpenChangePassword(true)}
              onOpenChangePasscode={() => setOpenChangePasscode(true)}
              onOpenSetSecurity={() => setOpenSetSecurity(true)}
              onOpenLinked={() => setOpenLinked(true)}
              onOpenDelete={() => setOpenDelete(true)}
            />
          ) : null}

          {tab === "preferences" ? <PreferencesTab /> : null}
        </div>
      </div>

      <ChangeEmailModal
        isOpen={openChangeEmail}
        onClose={() => setOpenChangeEmail(false)}
        onSubmit={(newEmail: string) => {
          setPendingEmail(newEmail);
          setOpenChangeEmail(false);
          setOpenVerifyEmail(true);
        }}
      />
      <VerifyEmailModal
        isOpen={openVerifyEmail}
        onClose={() => setOpenVerifyEmail(false)}
        email={pendingEmail || user?.email || "your email"}
        onSubmit={(code: string) => {
          if (!code) return;
          setValue("email", pendingEmail || user?.email || "");
          setOpenVerifyEmail(false);
          SuccessToast({ title: "Email verified", description: "Your email has been updated successfully." });
        }}
      />

      <ChangePhoneInfoModal
        isOpen={openChangePhone}
        onClose={() => setOpenChangePhone(false)}
        onNext={() => {
          setOpenChangePhone(false);
          setOpenEnterPhone(true);
        }}
      />
      <ChangePhoneEnterModal
        isOpen={openEnterPhone}
        onClose={() => setOpenEnterPhone(false)}
        currentPhone={currentPhone}
        onValidateSuccess={(newPhone: string) => {
          setPendingPhone(newPhone);
          setOpenEnterPhone(false);
          setOpenVerifyPhone(true);
        }}
      />
      <VerifyPhoneModal
        isOpen={openVerifyPhone}
        onClose={() => {
          setOpenVerifyPhone(false);
          setPendingPhone("");
        }}
        phone={pendingPhone || currentPhone}
      />

      <UpdateUsernameModal
        isOpen={openUpdateUsername}
        onClose={() => setOpenUpdateUsername(false)}
        onSubmit={(username: string) => {
          setValue("username", username);
          setOpenUpdateUsername(false);
          SuccessToast({ title: "Username updated", description: "Your username has been updated successfully" });
        }}
      />
      <UpdateAddressModal
        isOpen={openUpdateAddress}
        onClose={() => setOpenUpdateAddress(false)}
        onSubmit={(addr: string) => {
          setAddressDisplay(addr);
          setOpenUpdateAddress(false);
          SuccessToast({ title: "Address updated", description: "Your address has been updated successfully" });
        }}
      />

      <ChangeTransactionPinModal isOpen={openChangePin} onClose={() => setOpenChangePin(false)} />
      <ForgotTransactionPinModal isOpen={openForgotPin} onClose={() => setOpenForgotPin(false)} />
      <ChangePasswordModal isOpen={openChangePassword} onClose={() => setOpenChangePassword(false)} />
      <ChangePasscodeModal isOpen={openChangePasscode} onClose={() => setOpenChangePasscode(false)} />
      <SetSecurityQuestionsModal isOpen={openSetSecurity} onClose={() => setOpenSetSecurity(false)} onSubmit={() => SuccessToast({ title: "Saved", description: "Security questions have been saved successfully" })} />
      <LinkedAccountsModal isOpen={openLinked} onClose={() => setOpenLinked(false)} />
      <DeleteAccountModal isOpen={openDelete} onClose={() => setOpenDelete(false)} />
      <VerifyWalletPinModal
        isOpen={openVerifyPinForFingerprint}
        onClose={() => {
          setOpenVerifyPinForFingerprint(false);
          setPendingFingerprintEnable(false);
        }}
        onVerify={() => {
          if (pendingFingerprintEnable) {
            setFingerprintPaymentEnabled(true);
            SuccessToast({
              title: "Fingerprint Payment Enabled",
              description: "You can now use fingerprint or Face ID for payments",
            });
            setPendingFingerprintEnable(false);
          }
          setOpenVerifyPinForFingerprint(false);
        }}
      />
    </>
  );
};

export default ProfileSettingsContent;


