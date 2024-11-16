"use client";

import { Fragment, useState } from "react";
import {
   Button,
   Description,
   Dialog,
   DialogPanel,
   DialogTitle,
   Transition,
} from "@headlessui/react";
import Image from "next/image";

const Modal = () => {
   let [isOpen, setIsOpen] = useState(true);
   let [email, setEmail] = useState("");
   let [isSubmitting, setIsSubmitting] = useState(false);

   const openModal = () => {
      setIsOpen(true);
   };

   const closeModal = () => {
      setIsOpen(false);
   };

   const handleSubmit = () => {};

   return (
      <>
         <button type="button" className="btn" onClick={openModal}>
            Track
         </button>

         <Dialog
            open={isOpen}
            as="div"
            className="dialog-container"
            onClose={closeModal}
         >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
               <div className="flex min-h-full items-center justify-center p-4">
                  <DialogPanel transition className="dialog-content">
                     <DialogTitle as="div" className="flex justify-between">
                        <div className="p-3 border border-gray-200 rounded-10 w-fit">
                           <Image
                              src="/assets/icons/logo.svg"
                              alt="logo"
                              width={28}
                              height={28}
                           />
                        </div>

                        <Image
                           src="/assets/icons/x-close.svg"
                           alt="close"
                           width={24}
                           height={24}
                           className="cursor-pointer"
                           onClick={closeModal}
                        />
                     </DialogTitle>
                     <div className="flex flex-col ">
                        <h4 className="dialog-head_text">
                           Stay updated with product pricing alerts right in
                           your inbox!
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                           Never miss a bargain again with our timely alerts!
                        </p>
                     </div>
                     <form
                        className="flex flex-col mt-5"
                        onSubmit={handleSubmit}
                     >
                        <label
                           htmlFor="email"
                           className="text-sm font-medium text-gray-700"
                        >
                           Email address
                        </label>
                        <div className="dialog-input_container">
                           <Image
                              src="/assets/icons/mail.svg"
                              alt="mail"
                              width={18}
                              height={18}
                           />

                           <input
                              required
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="dialog-input"
                           />
                        </div>

                        <button type="submit" className="dialog-btn">
                           {isSubmitting ? "Submitting..." : "Track"}
                        </button>
                     </form>
                  </DialogPanel>
               </div>
            </div>
         </Dialog>
      </>
   );
};

export default Modal;

