/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TemplateId = 
  | 'enterprise-philosophy'
  | 'enterprise-blueprint'
  | 'industry-spotlight'
  | 'building-apex'
  | 'enterprise-vision';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultQuote: string;
  defaultFooter: string;
}

export type BackgroundId =
  | 'matte-black'
  | 'executive'
  | 'gold-mesh'
  | 'digital-grid'
  | 'minimal'
  | 'gradient'
  | 'abstract-ai'
  | 'corporate'
  | 'enterprise-lines';

export interface BackgroundOption {
  id: BackgroundId;
  name: string;
  description: string;
  class: string;
}

export interface BrandSettings {
  logoUrl: string;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  watermarkText: string;
  socialHandle: string;
  website: string;
  email: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  settings: BrandSettings;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'active' | 'archived';

export interface StudioProject {
  id: string;
  brandId: string;
  name: string;
  campaignName: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  duplicatedFromId?: string;
}

export interface ExportHistoryItem {
  id: string;
  timestamp: string;
  brandSnapshot?: BrandSettings;
  projectId?: string;
  projectName?: string;
  templateId: TemplateId;
  templateName: string;
  headline: string;
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  resolution: string;
  subtitle?: string;
  quote?: string;
  backgroundId?: BackgroundId;
  series?: string;
  episode?: string;
  day?: string;
  showLogo?: boolean;
  showFooter?: boolean;
  showDayCounter?: boolean;
  showEpisode?: boolean;
  showQrCode?: boolean;
  showWebsite?: boolean;
  headlineSize?: number;
  headlineOffset?: number;
  headlineAlign?: string;
  subtitleSize?: number;
  subtitleOffset?: number;
  subtitleAlign?: string;
  quoteSize?: number;
  quoteOffset?: number;
  quoteAlign?: string;
  metaSize?: number;
  metaOffset?: number;
  footerSize?: number;
  footerOffset?: number;
  logoSize?: number;
  logoOffset?: number;
}

export interface EditorState {
  series: string;
  episode: string;
  day: string;
  templateId: TemplateId;
  headline: string;
  subtitle: string;
  quote: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  backgroundId: BackgroundId;
  showLogo: boolean;
  showFooter: boolean;
  showDayCounter: boolean;
  showEpisode: boolean;
  showQrCode: boolean;
  showWebsite: boolean;
}
