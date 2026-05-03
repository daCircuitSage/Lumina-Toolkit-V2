/**
 * Advanced Keyword Extraction with Context and Semantic Understanding
 */

export interface ExtractedKeyword {
  keyword: string;
  category: 'hard_skill' | 'soft_skill' | 'tool' | 'methodology' | 'experience_level' | 'certification';
  frequency: number;
  context: string[];
  relevanceScore: number;
  variations: string[];
}

export interface KeywordExtractionResult {
  keywords: ExtractedKeyword[];
  summary: {
    totalKeywords: number;
    hardSkills: number;
    softSkills: number;
    tools: number;
    methodologies: number;
    certifications: number;
    uniqueTerms: number;
  };
  keywordDensity: number;
  semanticVariations: Map<string, string[]>;
}

export class KeywordExtractor {
  private readonly HARD_SKILLS = new Set([
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift',
    'kotlin', 'scala', 'haskell', 'elixir', 'ruby', 'php', 'dart', 'r', 'matlab',
    'perl', 'lua', 'bash', 'powershell', 'sql', 'html', 'css', 'sass', 'less',
    
    // Frontend Technologies
    'react', 'vue', 'angular', 'svelte', 'solid', 'next.js', 'gatsby', 'nuxt.js',
    'remix', 'astro', 'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'babel',
    'tailwind', 'bootstrap', 'material-ui', 'chakra-ui', 'styled-components',
    'emotion', 'd3.js', 'chart.js', 'three.js', 'pixi.js',
    
    // Backend Technologies
    'node.js', 'deno', 'bun', 'express', 'koa', 'fastify', 'nestjs', 'hapi',
    'django', 'flask', 'fastapi', 'rails', 'sinatra', 'spring', 'spring-boot',
    'laravel', 'symfony', 'asp.net', 'blazor', 'fiber', 'echo', 'gin',
    
    // Databases
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
    'cassandra', 'dynamodb', 'cockroachdb', 'neo4j', 'influxdb', 'supabase',
    'prisma', 'typeorm', 'sequelize', 'mongoose',
    
    // Cloud & Infrastructure
    'aws', 'azure', 'gcp', 'digitalocean', 'heroku', 'vercel', 'netlify', 'cloudflare',
    'ec2', 's3', 'lambda', 'cloudfront', 'rds', 'route53', 'vpc', 'iam',
    'kubernetes', 'docker', 'containerd', 'podman', 'rancher', 'openshift',
    'terraform', 'pulumi', 'ansible', 'puppet', 'chef', 'salt',
    
    // DevOps & CI/CD
    'ci/cd', 'github-actions', 'gitlab-ci', 'jenkins', 'circleci', 'travisci',
    'drone', 'bamboo', 'teamcity', 'argocd', 'flux', 'helm', 'kustomize',
    
    // Testing & Quality
    'jest', 'vitest', 'mocha', 'jasmine', 'karma', 'cypress', 'playwright',
    'selenium', 'webdriver', 'puppeteer', 'testing-library', 'chai', 'sinon',
    
    // Security
    'oauth', 'jwt', 'ssl', 'tls', 'https', 'ssh', 'rsa', 'aes', 'bcrypt',
    'passport', 'auth0', 'okta', 'saml', 'ldap', 'rbac', 'acl', 'firewall',
    
    // Data Science & ML
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
    'matplotlib', 'seaborn', 'plotly', 'jupyter', 'spark', 'hadoop', 'airflow',
    'machine-learning', 'deep-learning', 'nlp', 'computer-vision',
    
    // Mobile Development
    'react-native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin',
    'cordova', 'ionic', 'unity', 'unreal', 'godot',
    
    // CMS & E-commerce
    'wordpress', 'drupal', 'joomla', 'magento', 'shopify', 'woocommerce',
    'strapi', 'contentful', 'sanity', 'prismic', 'storyblok',
  ]);

  private readonly SOFT_SKILLS = new Set([
    'leadership', 'communication', 'teamwork', 'problem-solving', 'critical thinking',
    'creativity', 'adaptability', 'time management', 'collaboration', 'interpersonal skills',
    'project management', 'analytical skills', 'attention to detail', 'organization',
    'multitasking', 'decision making', 'strategic thinking', 'negotiation',
    'public speaking', 'presentation skills', 'writing skills', 'research skills',
    'mentoring', 'coaching', 'delegation', 'conflict resolution', 'emotional intelligence',
    'innovation', 'initiative', 'self-motivation', 'work ethic', 'flexibility'
  ]);

  private readonly TOOLS = new Set([
    'vscode', 'vim', 'emacs', 'intellij', 'pycharm', 'webstorm', 'eclipse',
    'netbeans', 'xcode', 'android-studio', 'visual-studio', 'figma', 'sketch',
    'photoshop', 'illustrator', 'xd', 'invision', 'zeplin', 'postman', 'insomnia',
    'swagger', 'openapi', 'git', 'github', 'gitlab', 'bitbucket', 'jira', 'trello',
    'asana', 'monday', 'notion', 'airtable', 'clickup', 'linear', 'slack',
    'confluence', 'npm', 'yarn', 'pnpm', 'pip', 'conda', 'composer', 'maven',
    'gradle', 'sbt', 'leiningen', 'cargo', 'mix', 'nuget', 'cocoapods', 'carthage'
  ]);

  private readonly METHODOLOGIES = new Set([
    'agile', 'scrum', 'kanban', 'lean', 'tdd', 'bdd', 'devops', 'code-review',
    'pair-programming', 'refactoring', 'clean-code', 'solid', 'dry', 'kiss', 'yagni',
    'microservices', 'serverless', 'jamstack', 'spa', 'ssr', 'ssg', 'pwa',
    'web-components', 'custom-elements', 'shadow-dom', 'service-workers',
    'event-driven', 'cqrs', 'event-sourcing', 'domain-driven-design',
    'clean-architecture', 'hexagonal-architecture', 'continuous integration',
    'continuous deployment', 'container orchestration', 'infrastructure as code'
  ]);

  private readonly EXPERIENCE_LEVELS = new Set([
    'junior', 'mid-level', 'senior', 'lead', 'principal', 'staff', 'architect',
    'manager', 'director', 'vp', 'cto', 'c-level', 'executive', 'intern',
    'entry-level', 'associate', 'senior associate', 'manager', 'senior manager'
  ]);

  private readonly CERTIFICATIONS = new Set([
    'aws certified', 'azure certified', 'gcp certified', 'pmp', 'csm', 'cspo',
    'scrum master', 'product owner', 'certified developer', 'microsoft certified',
    'oracle certified', 'cisco certified', 'comptia', 'google certified',
    'facebook certified', 'salesforce certified', 'tableau certified', 'itil',
    'ccna', 'ccnp', 'mcp', 'mcsa', 'mcse', 'oca', 'ocp', 'rhce', 'lpi'
  ]);

  private readonly SYNONYM_GROUPS = new Map([
    ['javascript', ['js', 'javascript', 'ecmascript']],
    ['typescript', ['ts', 'typescript']],
    ['react', ['react', 'reactjs', 'react.js']],
    ['node.js', ['node', 'nodejs', 'node.js']],
    ['python', ['python', 'python3']],
    ['postgresql', ['postgres', 'postgresql']],
    ['mongodb', ['mongo', 'mongodb']],
    ['kubernetes', ['k8s', 'kubernetes']],
    ['ci/cd', ['cicd', 'ci/cd', 'continuous integration', 'continuous deployment']],
    ['machine learning', ['ml', 'machine learning', 'machine-learning']],
    ['artificial intelligence', ['ai', 'artificial intelligence', 'artificial-intelligence']],
    ['user interface', ['ui', 'user interface', 'user-interface']],
    ['user experience', ['ux', 'user experience', 'user-experience']],
    ['quality assurance', ['qa', 'quality assurance', 'quality-assurance']],
  ]);

  extractKeywords(text: string): KeywordExtractionResult {
    const normalizedText = this.normalizeText(text);
    const tokens = this.tokenize(normalizedText);
    const keywords = this.processTokens(tokens, normalizedText);
    const summary = this.generateSummary(keywords);
    const keywordDensity = this.calculateKeywordDensity(keywords, normalizedText);
    const semanticVariations = this.buildSemanticVariations(keywords);

    return {
      keywords: this.rankKeywords(keywords),
      summary,
      keywordDensity,
      semanticVariations
    };
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s\-\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text.split(/\s+/).filter(token => token.length > 1);
  }

  private processTokens(tokens: string[], context: string): ExtractedKeyword[] {
    const keywordMap = new Map<string, ExtractedKeyword>();

    for (const token of tokens) {
      const category = this.categorizeToken(token);
      if (category) {
        const existing = keywordMap.get(token);
        if (existing) {
          existing.frequency++;
          existing.context.push(this.extractContext(token, context));
        } else {
          keywordMap.set(token, {
            keyword: token,
            category,
            frequency: 1,
            context: [this.extractContext(token, context)],
            relevanceScore: 0,
            variations: this.getVariations(token)
          });
        }
      }
    }

    return Array.from(keywordMap.values());
  }

  private categorizeToken(token: string): ExtractedKeyword['category'] | null {
    if (this.HARD_SKILLS.has(token)) return 'hard_skill';
    if (this.SOFT_SKILLS.has(token)) return 'soft_skill';
    if (this.TOOLS.has(token)) return 'tool';
    if (this.METHODOLOGIES.has(token)) return 'methodology';
    if (this.EXPERIENCE_LEVELS.has(token)) return 'experience_level';
    if (this.CERTIFICATIONS.has(token)) return 'certification';
    return null;
  }

  private extractContext(keyword: string, text: string): string {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.includes(keyword)) {
        return sentence.trim().substring(0, 100);
      }
    }
    return '';
  }

  private getVariations(keyword: string): string[] {
    for (const [canonical, variations] of this.SYNONYM_GROUPS) {
      if (variations.includes(keyword)) {
        return variations.filter(v => v !== keyword);
      }
    }
    return [];
  }

  private rankKeywords(keywords: ExtractedKeyword[]): ExtractedKeyword[] {
    return keywords
      .map(keyword => ({
        ...keyword,
        relevanceScore: this.calculateRelevanceScore(keyword)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private calculateRelevanceScore(keyword: ExtractedKeyword): number {
    let score = 0;
    
    // Base score from frequency
    score += keyword.frequency * 10;
    
    // Category weighting
    const categoryWeights = {
      hard_skill: 30,
      tool: 25,
      methodology: 20,
      certification: 15,
      soft_skill: 10,
      experience_level: 5
    };
    score += categoryWeights[keyword.category] || 0;
    
    // Context quality bonus
    const avgContextLength = keyword.context.reduce((sum, ctx) => sum + ctx.length, 0) / keyword.context.length;
    score += Math.min(avgContextLength / 10, 10);
    
    // Variation bonus (indicates semantic richness)
    score += keyword.variations.length * 5;
    
    return score;
  }

  private generateSummary(keywords: ExtractedKeyword[]): KeywordExtractionResult['summary'] {
    const summary = {
      totalKeywords: keywords.length,
      hardSkills: 0,
      softSkills: 0,
      tools: 0,
      methodologies: 0,
      certifications: 0,
      uniqueTerms: new Set(keywords.map(k => k.keyword)).size
    };

    keywords.forEach(keyword => {
      switch (keyword.category) {
        case 'hard_skill': summary.hardSkills++; break;
        case 'soft_skill': summary.softSkills++; break;
        case 'tool': summary.tools++; break;
        case 'methodology': summary.methodologies++; break;
        case 'certification': summary.certifications++; break;
      }
    });

    return summary;
  }

  private calculateKeywordDensity(keywords: ExtractedKeyword[], text: string): number {
    const totalWords = text.split(/\s+/).length;
    const keywordInstances = keywords.reduce((sum, k) => sum + k.frequency, 0);
    return totalWords > 0 ? (keywordInstances / totalWords) * 100 : 0;
  }

  private buildSemanticVariations(keywords: ExtractedKeyword[]): Map<string, string[]> {
    const variations = new Map<string, string[]>();
    
    keywords.forEach(keyword => {
      if (keyword.variations.length > 0) {
        variations.set(keyword.keyword, keyword.variations);
      }
    });
    
    return variations;
  }
}

export const keywordExtractor = new KeywordExtractor();
