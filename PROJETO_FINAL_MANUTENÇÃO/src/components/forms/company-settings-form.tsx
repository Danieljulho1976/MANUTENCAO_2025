"use client";

import React, { useState, useEffect } from "react";
import { Save, Upload, Trash2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useCompanyData, type Company, type CompanyLogo, type UserProfile } from "@/hooks/useCompanyData";

// Interfaces are now imported from useCompanyData.ts

const CompanySettingsForm = () => {
  // Estados para dados da empresa
  const [company, setCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  
  // Estados para logos
  const [leftLogo, setLeftLogo] = useState<File | null>(null);
  const [rightLogo, setRightLogo] = useState<File | null>(null);
  const [leftLogoPreview, setLeftLogoPreview] = useState<string | null>(null);
  const [rightLogoPreview, setRightLogoPreview] = useState<string | null>(null);
  const [leftLogoId, setLeftLogoId] = useState<string | null>(null);
  const [rightLogoId, setRightLogoId] = useState<string | null>(null);
  
  // Estados auxiliares
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Carregar dados da empresa
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Usuário não autenticado");
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
        const userProfileData: UserProfile = {
          id: profileData.id,
          company_id: profileData.company_id,
          name: profileData.nome || null,
          email: profileData.email || null
        };
        
        setUserProfile(userProfileData);

        // If user has an associated company, fetch its data
        if (userProfileData.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", userProfileData.company_id)
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
          setCompanyName(companyInfo.name || "");
          setCompanyAddress(companyInfo.address || "");
          setCompanyPhone(companyInfo.phone || "");
          setCompanyEmail(companyInfo.email || "");
          setCompanyWebsite(companyInfo.website || "");

          // Fetch company logos
          const { data: logosData, error: logosError } = await supabase
            .from("company_logos")
            .select("*")
            .eq("company_id", userProfileData.company_id);

          if (logosError) {
            throw logosError;
          }

          if (logosData && logosData.length > 0) {
            // Process found logos
            logosData.forEach(logo => {
              // Map logo data to our interface
              const logoInfo: CompanyLogo = {
                id: logo.id,
                company_id: logo.company_id,
                logo_url: logo.logo_url,
                logo_position: logo.logo_position
              };
              
              if (logoInfo.logo_position === 'left') {
                setLeftLogoPreview(logoInfo.logo_url);
                setLeftLogoId(logoInfo.id);
              } else if (logoInfo.logo_position === 'right') {
                setRightLogoPreview(logoInfo.logo_url);
                setRightLogoId(logoInfo.id);
              }
            });
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados da empresa:', err);
        setError('Falha ao carregar dados da empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Manipular upload de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, position: 'left' | 'right') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Validar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('O tamanho máximo do arquivo é 2MB');
        return;
      }
      
      // Atualizar estado e preview
      if (position === 'left') {
        setLeftLogo(file);
        setLeftLogoPreview(URL.createObjectURL(file));
      } else {
        setRightLogo(file);
        setRightLogoPreview(URL.createObjectURL(file));
      }
    }
  };

  // Remove logo
  const handleRemoveLogo = async (position: 'left' | 'right') => {
    try {
      if (position === 'left' && leftLogoId) {
        // Remove logo from database
        const { error } = await supabase
          .from("company_logos")
          .delete()
          .eq('id', leftLogoId);
          
        if (error) throw error;
        
        setLeftLogo(null);
        setLeftLogoPreview(null);
        setLeftLogoId(null);
      } else if (position === 'right' && rightLogoId) {
        // Remove logo from database
        const { error } = await supabase
          .from("company_logos")
          .delete()
          .eq('id', rightLogoId);
          
        if (error) throw error;
        
        setRightLogo(null);
        setRightLogoPreview(null);
        setRightLogoId(null);
      }
      
      setSuccess(`Logo ${position === 'left' ? 'esquerdo' : 'direito'} removido com sucesso`);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Erro ao remover logo:', err);
      setError('Falha ao remover logo');
    }
  };

  // Salvar dados da empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (!companyName) {
        setError('O nome da empresa é obrigatório');
        setSaving(false);
        return;
      }
      
      if (!userProfile) {
        setError('Perfil de usuário não encontrado');
        setSaving(false);
        return;
      }
      
      let companyId = company?.id;
      
      // If company doesn't exist, create a new one
      if (!companyId) {
        const { data: newCompany, error: companyError } = await supabase
          .from("companies")
          .insert({
            nome: companyName,
            address: companyAddress || null,
            phone: companyPhone || null,
            email: companyEmail || null,
            website: companyWebsite || null
          })
          .select()
          .single();
          
        if (companyError) throw companyError;
        
        companyId = newCompany.id;
        
        // Update user profile with company ID
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ company_id: companyId })
          .eq('id', userProfile.id);
          
        if (profileError) throw profileError;
      } else {
        // Update existing company
        const { error: updateError } = await supabase
          .from("companies")
          .update({
            nome: companyName,
            address: companyAddress || null,
            phone: companyPhone || null,
            email: companyEmail || null,
            website: companyWebsite || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', companyId);
          
        if (updateError) throw updateError;
      }
      
      // Processar upload de logos
      if (leftLogo) {
        await uploadLogo(leftLogo, companyId, 'left', leftLogoId);
      }
      
      if (rightLogo) {
        await uploadLogo(rightLogo, companyId, 'right', rightLogoId);
      }
      
      setSuccess('Dados da empresa salvos com sucesso');
      
      // Atualizar estado da empresa
      setCompany({
        id: companyId,
        name: companyName,
        address: companyAddress,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite
      });
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Erro ao salvar dados da empresa:', err);
      setError('Falha ao salvar dados da empresa');
    } finally {
      setSaving(false);
    }
  };

  // Function for logo upload
  const uploadLogo = async (file: File, companyId: string, position: string, existingLogoId: string | null) => {
    try {
      // Sanitize file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `company-logos/${companyId}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL of the file
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);
      
      // If a logo already exists in this position, update it
      if (existingLogoId) {
        const { error: updateError } = await supabase
          .from("company_logos")
          .update({
            logo_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLogoId);
          
        if (updateError) throw updateError;
      } else {
        // Otherwise, insert a new logo
        const { error: insertError } = await supabase
          .from("company_logos")
          .insert({
            company_id: companyId,
            logo_url: publicUrl,
            logo_position: position
          });
          
        if (insertError) throw insertError;
      }
      
      // Update logo IDs
      const { data: logosData } = await supabase
        .from("company_logos")
        .select('*')
        .eq('company_id', companyId);
        
      if (logosData) {
        logosData.forEach(logo => {
          const logoInfo = {
            id: logo.id,
            company_id: logo.company_id,
            logo_url: logo.logo_url,
            logo_position: logo.logo_position
          };
          
          if (logoInfo.logo_position === 'left') {
            setLeftLogoId(logoInfo.id);
          } else if (logoInfo.logo_position === 'right') {
            setRightLogoId(logoInfo.id);
          }
        });
      }
    } catch (err) {
      console.error('Erro ao fazer upload do logo:', err);
      throw new Error('Falha ao fazer upload do logo');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Configurações da Empresa
        </h2>

        {error && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Nome da Empresa *
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label
                htmlFor="companyAddress"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Endereço
              </label>
              <input
                type="text"
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="companyPhone"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Telefone
              </label>
              <input
                type="text"
                id="companyPhone"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="companyEmail"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="companyEmail"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="companyWebsite"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Website
              </label>
              <input
                type="text"
                id="companyWebsite"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Logos da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Esquerdo */}
              <div className="border border-border rounded-md p-4">
                <h4 className="text-md font-medium mb-2">Logo Esquerdo</h4>
                
                <div className="flex flex-col items-center mb-4">
                  {leftLogoPreview ? (
                    <div className="relative w-40 h-20 mb-2">
                      <img
                        src={leftLogoPreview}
                        alt="Logo Esquerdo"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLogo('left')}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                        title="Remover Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-20 border border-dashed border-muted-foreground rounded-md flex items-center justify-center mb-2">
                      <span className="text-sm text-muted-foreground">Sem logo</span>
                    </div>
                  )}
                  
                  <label
                    htmlFor="leftLogo"
                    className="cursor-pointer px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Selecionar Logo</span>
                    <input
                      type="file"
                      id="leftLogo"
                      accept="image/*"
                      onChange={(e) => handleLogoChange(e, 'left')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 2MB.
                </p>
              </div>
              
              {/* Logo Direito */}
              <div className="border border-border rounded-md p-4">
                <h4 className="text-md font-medium mb-2">Logo Direito</h4>
                
                <div className="flex flex-col items-center mb-4">
                  {rightLogoPreview ? (
                    <div className="relative w-40 h-20 mb-2">
                      <img
                        src={rightLogoPreview}
                        alt="Logo Direito"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLogo('right')}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                        title="Remover Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-20 border border-dashed border-muted-foreground rounded-md flex items-center justify-center mb-2">
                      <span className="text-sm text-muted-foreground">Sem logo</span>
                    </div>
                  )}
                  
                  <label
                    htmlFor="rightLogo"
                    className="cursor-pointer px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Selecionar Logo</span>
                    <input
                      type="file"
                      id="rightLogo"
                      accept="image/*"
                      onChange={(e) => handleLogoChange(e, 'right')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "px-4 py-2 rounded-md text-primary-foreground flex items-center space-x-1 bg-primary hover:bg-primary/80",
                saving && "opacity-70 cursor-not-allowed"
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanySettingsForm;
