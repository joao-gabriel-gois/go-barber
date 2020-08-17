import { compile } from 'handlebars'

import IParseMailTemplateDTO from '../DTOs/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ template, variables }: IParseMailTemplateDTO): Promise<string> {
    const parseTemplate = compile(template);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
