'use client';

interface RegisterFormProps {
  registerForm: {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    employmentType: string;
    salaryRate: string;
    password: string;
    confirmPassword: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBackToLogin: () => void;
}

export default function RegisterForm({ 
  registerForm, 
  isLoading, 
  onSubmit, 
  onChange, 
  onBackToLogin 
}: RegisterFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={registerForm.firstName}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={registerForm.lastName}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="registerEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Email *
        </label>
        <input
          id="registerEmail"
          name="email"
          type="email"
          required
          value={registerForm.email}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="position"
          className="block text-sm font-medium text-gray-700"
        >
          Position *
        </label>
        <input
          id="position"
          name="position"
          type="text"
          required
          value={registerForm.position}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="employmentType"
            className="block text-sm font-medium text-gray-700"
          >
            Employment Type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={registerForm.employmentType}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="salaryRate"
            className="block text-sm font-medium text-gray-700"
          >
            Salary Rate
          </label>
          <input
            id="salaryRate"
            name="salaryRate"
            type="number"
            step="0.01"
            value={registerForm.salaryRate}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="registerPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Password *
        </label>
        <input
          id="registerPassword"
          name="password"
          type="password"
          required
          value={registerForm.password}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={registerForm.confirmPassword}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 transition-colors transform active:scale-[0.97] duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div
        className="text-sm text-gray-700 hover:underline cursor-pointer text-center"
        onClick={onBackToLogin}
      >
        Back to login
      </div>
    </form>
  );
}