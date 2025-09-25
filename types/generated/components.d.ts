import type { Schema, Struct } from '@strapi/strapi';

export interface AboutAchievement extends Struct.ComponentSchema {
  collectionName: 'components_about_achievements';
  info: {
    description: 'Professional achievement or certification';
    displayName: 'Achievement';
    icon: 'trophy';
  };
  attributes: {
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutEducation extends Struct.ComponentSchema {
  collectionName: 'components_about_education';
  info: {
    description: 'Educational background entry';
    displayName: 'Education';
    icon: 'graduation-cap';
  };
  attributes: {
    degree: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.Date;
    institution: Schema.Attribute.String & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
  };
}

export interface AboutExperience extends Struct.ComponentSchema {
  collectionName: 'components_about_experiences';
  info: {
    description: 'Professional work experience entry';
    displayName: 'Experience';
    icon: 'briefcase';
  };
  attributes: {
    company: Schema.Attribute.String & Schema.Attribute.Required;
    current: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    endDate: Schema.Attribute.Date;
    position: Schema.Attribute.String & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
  };
}

export interface SharedCodeBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_code_blocks';
  info: {
    description: 'A component for displaying code snippets with syntax highlighting';
    displayName: 'Code Block';
    icon: 'code';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    filename: Schema.Attribute.String;
    language: Schema.Attribute.Enumeration<
      [
        'javascript',
        'typescript',
        'html',
        'css',
        'json',
        'dart',
        'ruby',
        'jsx',
        'tsx',
        'python',
        'java',
        'bash',
        'sql',
        'markdown',
        'yaml',
        'xml',
        'php',
        'go',
        'rust',
        'c',
        'cpp',
        'csharp',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'javascript'>;
    showLineNumbers: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.achievement': AboutAchievement;
      'about.education': AboutEducation;
      'about.experience': AboutExperience;
      'shared.code-block': SharedCodeBlock;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
