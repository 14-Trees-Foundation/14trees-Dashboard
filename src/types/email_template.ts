

export type EmailTemplate = {
  id: number,
  key: number;
  event_type: string,
  event_name: string,
  template_type: string,
  template_name: string,
  create_at: string,
  updated_at: string,
};

export type EmailTemplatePaginationResponse = {
  total: number,
  result: EmailTemplate[]
}

export type EmailTemplatesDataState = {
  totalEmailTemplates: number,
  EmailTemplates: Record<string, EmailTemplate>
}