import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

// Interface definitions
export interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface CompanyLogo {
  id: string;
  company_id: string;
  logo_url: string;
  logo_position: string;
}

export interface UserProfile {
  id: string;
  company_id: string | null;
  name: string | null;
  email: string | null;
}

// Custom hook for fetching company data
export function useCompanyData() {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyLogos, setCompanyLogos] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Map profile data to our interface
        const userProfile: UserProfile = {
          id: profileData.id,
          company_id: profileData.company_id,
          name: profileData.nome || null,
          email: profileData.email || null
        };

        if (!userProfile.company_id) {
          setLoading(false);
          return;
        }

        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", userProfile.company_id)
          .single();

        if (companyError) {
          throw companyError;
        }

        // Map company data to our interface
        const companyInfo: Company = {
          id: companyData.id,
          name: companyData.nome || "",
          address: companyData.address || null,
          phone: companyData.phone || null,
          email: companyData.email || null,
          website: companyData.website || null
        };

        setCompany(companyInfo);

        // Fetch company logos
        const { data: logosData, error: logosError } = await supabase
          .from("company_logos")
          .select("*")
          .eq("company_id", userProfile.company_id);

        if (logosError) {
          throw logosError;
        }

        // Map logo data to our interface
        const logos: CompanyLogo[] = logosData ? logosData.map(logo => ({
          id: logo.id,
          company_id: logo.company_id,
          logo_url: logo.logo_url,
          logo_position: logo.logo_position
        })) : [];

        setCompanyLogos(logos);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  return { company, companyLogos, loading, error };
}
