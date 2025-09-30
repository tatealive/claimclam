  import { useState, useRef } from "react";
  import { useForm, Controller, type FieldErrors } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useRouter } from "@tanstack/react-router";
  import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Input,
    Textarea,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Progress } from "@heroui/react";
  import { addToast } from "@heroui/toast";
  import { receiptSchema, ReceiptFormData } from "../schemas/receiptSchema";
  import { useReceipts } from "../store/receiptStore";
  import FilePreview from "./FilePreview";
  import { departments, categories } from "../data/mockReceipts";
  import { logError } from "../utils/errorLogger";

  export function ReceiptSubmissionForm() {
    const router = useRouter();
    const { addReceipt } = useReceipts();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const uploadController = useRef<{ cancelled: boolean }>({ cancelled: false });

    const {
      control,
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      reset,
      trigger,
    } = useForm<ReceiptFormData>({
      resolver: zodResolver(receiptSchema),
      mode: "all",
      reValidateMode: "onChange",
      defaultValues: {
        amount: undefined,
        date: new Date().toISOString().split("T")[0],
        vendor: "",
        category: "",
        description: "",
        employeeName: "",
        department: "",
        attachment: null as any,
      },
    });

    const selectedFile = watch("attachment");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (selectedFile && selectedFile.name === file.name && selectedFile.size === file.size) {
          addToast({
            title: "File already uploaded",
            description: `${file.name} is already selected.`,
            color: "warning",
          });
          return;
        }

        setValue("attachment", file);
        trigger("attachment");
        setIsUploaded(false);

        simulateFileUpload()
          .then(() => {
            setIsUploaded(true);
            addToast({
              title: "Upload complete",
              description: "Your file has been uploaded.",
              color: "success",
              timeout: 3000,
            });
          })
          .catch((err) => {
            logError("File upload failed", err);
            setValue("attachment", null as any, { shouldValidate: true });
            setIsUploaded(false);
            if (err.message !== "Upload cancelled") {
              addToast({
                title: "Upload failed",
                description: "There was an error uploading your file.",
                color: "danger",
                timeout: 3000,
              });
            }
          });
      }
    };

    const handleFileRemove = () => {
      uploadController.current.cancelled = true;
      setIsUploading(false);
      setValue("attachment", null as any, { shouldValidate: true });
      setIsUploaded(false);
      const fileInput = document.getElementById("attachment") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      // Trigger validation to show error if attachment is required
      trigger("attachment");
      
       // Show info toast for file removal
       addToast({
         title: "File removed",
         description: "The selected file has been removed.",
         color: "warning",
       });
    };

    const simulateFileUpload = (): Promise<void> => {
      setIsUploading(true);
      uploadController.current.cancelled = false;
    
      const uploadPromise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (uploadController.current.cancelled) {
            setIsUploading(false);
            return reject(new Error("Upload cancelled"));
          }
          setIsUploading(false);
          resolve();
        }, 2000);
      });
    
      // Uploading toast (auto-dismiss after ~2s)
      addToast({
        title: "Uploading file...",
        description: "Please wait while we upload your attachment.",
        color: "primary",
        timeout: 2000, // this way it disappears on its own
      });
    
      return uploadPromise;
    };
    

const simulateFormSubmit = (): Promise<void> => {
  const submitPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

  // Only show the "submitting" toast here
  addToast({
    title: "Submitting form...",
    description: "Please wait while we process your receipt.",
    color: "primary",
    timeout: 2000,
  });

  return submitPromise;
};
    

    const onSubmit = async (data: ReceiptFormData) => {
      setIsSubmitting(true);

      try {
        await simulateFormSubmit();

        addReceipt({
          amount: data.amount,
          date: data.date,
          vendor: data.vendor,
          category: data.category as any,
          description: data.description || "",
          employeeName: data.employeeName,
          department: data.department as any,
          status: "Pending",
          attachmentName: data.attachment?.name,
        });

        // Show success state with fade
        setIsSuccess(true);
        addToast({
          title: "Success",
          description: "Your receipt has been submitted successfully.",
          color: "success",
          timeout: 3000,
        });

        // Reset form after fade animation completes
        setTimeout(() => {
          reset();
          setIsUploaded(false);
          setIsSuccess(false);
          const fileInput = document.getElementById("attachment") as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
          }
          // Scroll back to top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000); // Wait for fade animation to complete

      } catch (error) {
        logError("Error submitting receipt", error);
        addToast({
          title: "Error",
          description: "There was a problem submitting your receipt.",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

     const onError = (errors: FieldErrors<ReceiptFormData>) => {
       addToast({
         title: "Validation Error",
         description: "Please fill in all required fields correctly before submitting.",
         color: "danger",
         timeout: 2000,
       });

       const firstErrorKey = Object.keys(errors)[0];
       if (firstErrorKey) {
         const el = document.querySelector<HTMLInputElement>(`[name="${firstErrorKey}"]`);
         el?.focus();
       }
     };

     return (
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8 relative">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="pb-6 flex justify-center">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">Submit Your Expense Receipt</h1>
              <p className="text-sm text-gray-600">
                Let's claim those clams.
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
             <form onSubmit={handleSubmit(onSubmit, onError)} className={`space-y-6 transition-opacity duration-500 ${isSubmitting ? 'opacity-50 pointer-events-none' : isSuccess ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              {/* 1. File Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">
                  1. Attach Your Receipt <span className="text-red-500">*</span>
                </h3>
                
                {selectedFile ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FilePreview file={selectedFile as File} fileName={selectedFile.name} width={64} height={64} showModal={true} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-blue-800 truncate">{selectedFile.name}</p>
                            {!isUploading && isUploaded && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-medium whitespace-nowrap">Uploaded</span>
                            )}
                          </div>
                          <p className="text-xs text-blue-600">
                            {selectedFile?.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="ml-3 p-1 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Remove file"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {isUploading && (
                      <div className='mt-2'>
                        <Progress aria-label='Uploading' value={50} isIndeterminate color='primary' />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="attachment"
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-500','bg-blue-50'); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-500','bg-blue-50'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-500','bg-blue-50');
                      if (e.dataTransfer.files?.[0]) {
                        const fileInput = document.getElementById('attachment') as HTMLInputElement;
                        const file = e.dataTransfer.files[0];
                        // set the file into the input manually
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;
                        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                    }}
                    className={`cursor-pointer border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors min-h-[96px] flex items-center justify-center ${
                      errors.attachment ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="text-gray-600">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Upload Your Receipt
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-gray-500">
                          (PNG, JPG, PDF up to 10MB)
                        </p>
                      </div>
                    </div>
                    <input
                      id="attachment"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
                
                {errors.attachment && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.attachment.message}
                  </p>
                )}
                
              </div>

              {/* 2. Personal Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">
                  2. Enter Your Name
                </h3>
                
                {/* Employee Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground-400">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("employeeName")}
                    type="text"
                    variant="bordered"
                    placeholder="e.g. John Smith"
                    isInvalid={!!errors.employeeName}
                    errorMessage={errors.employeeName?.message}
                    classNames={{
                      inputWrapper: errors.employeeName ? "border-red-500" : "border-gray-300",
                      input: "placeholder:text-gray-400"
                    }}
                  />
                </div>
              </div>

              {/* 3. Receipt Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">
                  3. Enter Purchase Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground-400">
                      Total Amount <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          variant="bordered"
                          placeholder="Enter dollar amount"
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                field.onChange(numValue);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                field.onChange(numValue);
                              }
                            }
                          }}
                          isInvalid={!!errors.amount}
                          errorMessage={errors.amount?.message}
                          startContent={<span className="text-gray-500 font-medium">$</span>}
                          classNames={{
                            input: "placeholder:text-left placeholder:text-gray-400",
                            inputWrapper: errors.amount ? "border-red-500" : "border-gray-300"
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground-400">
                      Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("date")}
                      type="date"
                      variant="bordered"
                      max={new Date().toISOString().split("T")[0]}
                      isInvalid={!!errors.date}
                      errorMessage={errors.date?.message}
                      classNames={{
                        inputWrapper: errors.date ? "border-red-500" : "border-gray-300",
                        input: "placeholder:text-gray-400"
                      }}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </div>

              </div>

              {/* 4. Vendor & Expense Classification Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">
                  4. Confirm Vendor & Expense Type
                </h3>
                
                {/* Vendor */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground-400">
                    Merchant/Vendor <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("vendor")}
                    type="text"
                    variant="bordered"
                    placeholder="e.g. Officeworks"
                    isInvalid={!!errors.vendor}
                    errorMessage={errors.vendor?.message}
                    classNames={{
                      inputWrapper: errors.vendor ? "border-red-500" : "border-gray-300",
                      input: "placeholder:text-gray-400"
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-start">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground-400">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="bordered"
                              className={`w-full justify-between ${
                                errors.category ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              {field.value || "Select expense category"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Category selection"
                            selectedKeys={field.value ? [field.value] : []}
                            onAction={(key) => {
                              field.onChange(key as string);
                              setValue("category", key as string);
                            }}
                            classNames={{
                              base: "bg-white border border-gray-200 shadow-lg z-50"
                            }}
                          >
                            {categories.map((c) => (
                              <DropdownItem key={c}>{c}</DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground-400">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="bordered"
                              className={`w-full justify-between ${
                                errors.department ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              {field.value || "Select the department"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Department selection"
                            selectedKeys={field.value ? [field.value] : []}
                            onAction={(key) => {
                              field.onChange(key as string);
                              setValue("department", key as string);
                            }}
                            classNames={{
                              base: "bg-white border border-gray-200 shadow-lg z-50"
                            }}
                          >
                            {departments.map((d) => (
                              <DropdownItem key={d}>{d}</DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                  </div>
                </div>

              </div>

              {/* 5. Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">
                  5. Enter Additional Info
                </h3>
                
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground-400">
                    Description (optional) <span className="text-gray-500 font-normal"></span>
                  </label>
                  <Textarea
                    {...register("description")}
                    variant="bordered"
                    placeholder="e.g. Team lunch meeting or project supplies"
                    maxLength={500}
                    errorMessage={errors.description?.message}
                    classNames={{
                      inputWrapper: errors.description ? "border-red-500" : "border-dashed border-2 border-gray-300",
                      input: "placeholder:text-gray-400"
                    }}
                  />
                </div>
              </div>

              {/* Submit & Cancel */}
              <CardFooter className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="bordered"
                  onPress={() => router.navigate({ to: "/dashboard" })}
                  className="px-6"
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || isUploading}
                  className="px-6"
                >
                  {isSubmitting ? "Submitting..." : "Submit Receipt"}
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
        
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex items-center justify-center rounded-lg transition-opacity duration-500">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-900">Receipt Submitted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your receipt has been submitted and is under review.</p>
            </div>
          </div>
        )}
      </div>
    );
  }
