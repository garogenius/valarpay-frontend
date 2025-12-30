"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

import { useTier3Verification } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface UpgradeTier3ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "address" | "success";

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

function Dropdown({
  label,
  value,
  placeholder,
  items,
  isOpen,
  onToggle,
  onSelect,
  dropdownRef,
}: {
  label: string;
  value: string;
  placeholder: string;
  items: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative" ref={dropdownRef}>
      <p className="text-gray-400 text-[11px] mb-1">{label}</p>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white"
      >
        <span className={value ? "text-white" : "text-gray-600"}>{value || placeholder}</span>
        <FiChevronDown className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full mt-2 w-full bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-56 overflow-y-auto">
          {items.map((it) => (
            <button
              key={it}
              type="button"
              onClick={() => onSelect(it)}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
            >
              {it}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const UpgradeTier3Modal: React.FC<UpgradeTier3ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>("address");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [houseDescription, setHouseDescription] = useState("");

  const [stateOpen, setStateOpen] = useState(false);
  const [lgaOpen, setLgaOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const stateRef = useRef<HTMLDivElement>(null);
  const lgaRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(stateRef, () => setStateOpen(false));
  useOnClickOutside(lgaRef, () => setLgaOpen(false));
  useOnClickOutside(areaRef, () => setAreaOpen(false));

  const lgas = useMemo(() => {
    if (!state) return ["LGA 1", "LGA 2", "LGA 3", "LGA 4"];
    return ["LGA 1", "LGA 2", "LGA 3", "LGA 4"];
  }, [state]);

  const areas = useMemo(() => {
    if (!lga) return ["Area 1", "Area 2", "Area 3", "Area 4"];
    return ["Area 1", "Area 2", "Area 3", "Area 4"];
  }, [lga]);

  const handleClose = () => {
    setStep("address");
    setState("");
    setLga("");
    setArea("");
    setAddress("");
    setLandmark("");
    setHouseDescription("");
    setStateOpen(false);
    setLgaOpen(false);
    setAreaOpen(false);
    onClose();
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Upgrade Successful",
      description: "Successfully upgraded to Tier 3",
    });
    setStep("success");
    setTimeout(() => {
      handleClose();
      window.location.reload();
    }, 1500);
  };

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Error upgrading tier",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const { mutate: verify, isPending } = useTier3Verification(onError, onSuccess);

  const canNextAddress = !!state && !!lga && !!area && !!address && !!landmark && !!houseDescription;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={step === "success" ? undefined : handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 pt-4 pb-4 border-b border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold">Upgrade to Tier 3</p>
                <p className="text-gray-400 text-xs mt-1">
                  Enter your current home address to help us verify your identity and location
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isPending || step === "success"}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-5 py-5 max-h-[75vh] overflow-y-auto">
            {step === "address" ? (
              <div className="space-y-4">
                <Dropdown
                  label="State"
                  value={state}
                  placeholder="Select state"
                  items={nigeriaStates}
                  isOpen={stateOpen}
                  onToggle={() => {
                    setStateOpen((v) => !v);
                    setLgaOpen(false);
                    setAreaOpen(false);
                  }}
                  onSelect={(v) => {
                    setState(v);
                    setLga("");
                    setArea("");
                    setStateOpen(false);
                  }}
                  dropdownRef={stateRef}
                />

                <Dropdown
                  label="LGA"
                  value={lga}
                  placeholder="Select LGA"
                  items={lgas}
                  isOpen={lgaOpen}
                  onToggle={() => {
                    if (!state) return;
                    setLgaOpen((v) => !v);
                    setStateOpen(false);
                    setAreaOpen(false);
                  }}
                  onSelect={(v) => {
                    setLga(v);
                    setArea("");
                    setLgaOpen(false);
                  }}
                  dropdownRef={lgaRef}
                />

                <Dropdown
                  label="Area"
                  value={area}
                  placeholder="Select area"
                  items={areas}
                  isOpen={areaOpen}
                  onToggle={() => {
                    if (!lga) return;
                    setAreaOpen((v) => !v);
                    setStateOpen(false);
                    setLgaOpen(false);
                  }}
                  onSelect={(v) => {
                    setArea(v);
                    setAreaOpen(false);
                  }}
                  dropdownRef={areaRef}
                />

                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">Address</p>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">Landmark</p>
                  <input
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Enter landmark"
                    className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">House Description</p>
                  <input
                    value={houseDescription}
                    onChange={(e) => setHouseDescription(e.target.value)}
                    placeholder="Enter house description"
                    className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={!canNextAddress}
                  onClick={() => {
                    // Backend currently requires only state/city/address; send LGA as city for best match.
                    verify({
                      state,
                      city: lga,
                      address,
                    });
                  }}
                  className="w-full rounded-full bg-[#FF6B2C] text-black text-sm font-semibold py-3 hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            ) : null}

            {step === "success" ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <span className="text-green-500 text-2xl">✓</span>
                </div>
                <p className="text-white text-base font-semibold mt-4">Upgrade Successful!</p>
                <p className="text-gray-400 text-sm mt-1">You have been upgraded to Tier 3</p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradeTier3Modal;


