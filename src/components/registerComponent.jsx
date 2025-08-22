import { ChevronDown } from "lucide-react";
import React from "react";

const RegisterSection = ({
  form,
  setForm,
  handleChange,
  handleSubmit,
  handleImageChange,
  isLoading,
}) => {
  return (
    <section id="register" className="relative py-16 sm:py-16 lg:py-5 px-4 sm:px-6 lg:px-8 " >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-28 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-[var(--color-readmore)]/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-5 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-[var(--color-secheading)]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-8 sm:py-12">
          
          {/* Mobile Title - Shows only on mobile */}
          <div className="lg:hidden text-center mb-8 animate-[professionalSlideIn_1s_ease-out] order-1">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6
                            bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                            bg-clip-text text-transparent leading-tight">
              Want to Join US?
            </h2>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
              <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
            </div>
          </div>

          {/* Desktop Title - Shows only on desktop */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 animate-[professionalSlideIn_1s_ease-out] order-2 lg:order-1">
            <div>
              <h2 className="text-5xl sm:text-6xl lg:text-6xl xl:text-[6rem] font-bold -mb-1 sm:-mb-2
                              bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                              bg-clip-text text-transparent leading-none">
                Want
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[4rem] font-bold -mb-4 sm:-mb-6 md:-mb-8
                              bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                              bg-clip-text text-transparent leading-none">
                to Join
              </h2>
              <h2 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[15rem] font-bold mb-4 sm:mb-6
                              bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                              bg-clip-text text-transparent leading-none">
                US?
              </h2>
              
              {/* Decorative line */}
              <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="flex flex-col justify-center animate-[fadeInScale_0.8s_ease-out_0.2s_both] order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6 p-0 sm:p-6 lg:p-1 
              w-full max-w-4xl mx-auto"
            >

              {/* Input fields */}
              <div className="space-y-3 sm:space-y-4">
                {/* Name fields - Stack on mobile, side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="First Name*"
                            className="p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                    placeholder:text-gray-400 border border-white/20
                                    focus:border-[var(--color-primary)] focus:ring-2
                                    focus:ring-[var(--color-primary)]/50
                                    transition-all duration-300 hover:border-[var(--color-highlight)]"
                        />

                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Last Name*"
                            className="p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                    placeholder:text-gray-400 border border-white/20
                                    focus:border-[var(--color-primary)] focus:ring-2
                                    focus:ring-[var(--color-primary)]/50
                                    transition-all duration-300 hover:border-[var(--color-highlight)]"
                        />
                    </div>

                    <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-2
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone*"
                    className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-2
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    {/* DOB and Gender - Stack on mobile, side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                    border border-white/20 focus:border-[var(--color-primary)]
                                    focus:ring-2 focus:ring-[var(--color-primary)]/50
                                    transition-all duration-300 hover:border-[var(--color-highlight)]"
                        />

                        <div className="relative w-full">
                            <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                        border border-white/20 focus:border-[var(--color-primary)]
                                        focus:ring-2 focus:ring-[var(--color-primary)]/50
                                        transition-all duration-300 hover:border-[var(--color-highlight)]
                                        appearance-none pr-10 sm:pr-12"
                            >
                            <option value="" disabled className="text-gray-400">
                                Select gender
                            </option>
                            <option value="male" className="text-black">Male</option>
                            <option value="female" className="text-black">Female</option>
                            <option value="other" className="text-black">Other</option>
                            </select>

                            <ChevronDown 
                            size={16} 
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" 
                            />
                        </div>
                    </div>

                    <input
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    placeholder="Occupation*"
                    className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white text-sm sm:text-base
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-2
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address*"
                    rows={3}
                    className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white placeholder:text-gray-400 text-sm sm:text-base
                                border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-2
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)] resize-none"
                    />

                    {/* File upload */}
                    <div>
                    <label className="block text-xs sm:text-sm mb-2 text-gray-300 font-medium">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 sm:p-4 rounded-xl bg-white/5 text-white border border-white/20 text-xs sm:text-sm
                                file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0
                                file:bg-gradient-to-r file:from-[var(--color-primary)] file:to-[var(--color-readmore)]
                                file:text-white file:cursor-pointer file:font-semibold file:text-xs sm:file:text-sm
                                file:hover:opacity-90 transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    {form.imagePreview && (
                        <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/20">
                        <img
                            src={form.imagePreview}
                            alt="Preview"
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-[var(--color-primary)] shadow-lg"
                        />
                        <div className="flex flex-col gap-1 sm:gap-2 flex-1">
                            <span className="text-xs sm:text-sm text-gray-300">Image preview</span>
                            <button
                            type="button"
                            onClick={() =>
                                setForm((prev) => ({
                                ...prev,
                                image: null,
                                imagePreview: null,
                                }))
                            }
                            className="px-2 sm:px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200 text-xs sm:text-sm font-medium self-start"
                            >
                            Remove
                            </button>
                        </div>
                        </div>
                    )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 mt-4 sm:mt-6
                              ${
                                isLoading
                                  ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)] text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
                              }`}
                >
                  {isLoading ? "Registering Member..." : "Register New Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;