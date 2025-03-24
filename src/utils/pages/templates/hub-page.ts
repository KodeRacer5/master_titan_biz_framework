export const hubPageTemplate = {
  id: 'hub-page',
  name: 'Hub Page Template',
  version: '1.0',
  sections: [
    {
      type: 'hero',
      config: {
        title: '{{title}}',
        subtitle: '{{subtitle}}',
        backgroundImage: '{{backgroundImage}}',
        isDark: true
      }
    },
    {
      type: 'content',
      config: {
        layout: 'grid',
        columns: 2,
        items: []
      }
    },
    {
      type: 'related',
      config: {
        title: 'Related Content',
        layout: 'carousel',
        items: []
      }
    }
  ],
  schema: {
    title: 'string',
    subtitle: 'string',
    backgroundImage: 'string',
    content: 'array',
    related: 'array'
  }
};