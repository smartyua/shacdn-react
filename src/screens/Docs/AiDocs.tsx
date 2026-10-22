import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bot, FileText, Package, Plug, Sparkles, Terminal } from 'lucide-react';
import { Badge } from '../../components/Badge/Badge';
import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { useLocale } from '../../components/Locale/Locale';
import { Scrollspy, ScrollspyLink } from '../../components/Scrollspy/Scrollspy';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table/Table';
import { getAiDocsCopy, MCP_TOOLS } from './AiDocs.copy';
import styles from './AiDocs.module.scss';

const SERVER_PATH = '/path/to/shacdn/mcp/shacdn-server/dist/index.js';

const CLIENT_CONFIGS = [
  {
    name: 'Cursor',
    language: 'json',
    code: `// .cursor/mcp.json
{
  "mcpServers": {
    "shacdn": {
      "command": "node",
      "args": ["${SERVER_PATH}"]
    }
  }
}`,
  },
  {
    name: 'Claude Code',
    language: 'bash',
    code: `claude mcp add shacdn -- node ${SERVER_PATH}`,
  },
  {
    name: 'VS Code',
    language: 'json',
    code: `// .vscode/mcp.json
{
  "servers": {
    "shacdn": {
      "type": "stdio",
      "command": "node",
      "args": ["${SERVER_PATH}"]
    }
  }
}`,
  },
  {
    name: 'Codex',
    language: 'toml',
    code: `# ~/.codex/config.toml
[mcp_servers.shacdn]
command = "node"
args = ["${SERVER_PATH}"]`,
  },
];

const SECTION_IDS = ['connect', 'tools', 'skill', 'install', 'context', 'prompt'] as const;

const SECTION_ICONS = {
  connect: Plug,
  tools: Bot,
  skill: Sparkles,
  install: Terminal,
  context: FileText,
  prompt: Package,
} as const;

const asset = (file: string) => `${import.meta.env.BASE_URL}${file.replace(/^\//, '')}`;

export const AiDocs = () => {
  const { locale } = useLocale();
  const copy = getAiDocsCopy(locale);

  useEffect(() => {
    const previous = document.title;
    document.title = copy.documentTitle;
    return () => {
      document.title = previous;
    };
  }, [copy.documentTitle]);

  const heading = (id: (typeof SECTION_IDS)[number]) => {
    const Icon = SECTION_ICONS[id];
    return (
      <h2 className={styles.sectionTitle}>
        <Icon size={18} aria-hidden />
        {copy.sections[id]}
      </h2>
    );
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar} aria-label={copy.pageNav}>
        <p className={styles.sidebarTitle}>{copy.sidebarTitle}</p>
        <ul className={styles.sidebarList}>
          <li>
            <NavLink
              to="/docs/ai"
              className={({ isActive }) => `${styles.sidebarLink}${isActive ? ` ${styles.sidebarLinkActive}` : ''}`}
            >
              {copy.breadcrumb}
            </NavLink>
          </li>
        </ul>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {copy.sidebarTitle} / {copy.breadcrumb}
          </p>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.lead}>{copy.lead}</p>
          <p className={styles.text}>{copy.intro}</p>
        </header>

        <section id="connect" className={styles.section}>
          {heading('connect')}
          <p className={styles.text}>{copy.connect.body}</p>
          <p className={styles.text}>{copy.connect.buildFirst}</p>
          <CodeBlock language="bash" code={'npm install\nnpm run build:mcp'} />
          <CodeBlock files={CLIENT_CONFIGS} />
          <p className={styles.note}>{copy.connect.pathNote}</p>
        </section>

        <section id="tools" className={styles.section}>
          {heading('tools')}
          <p className={styles.text}>{copy.tools.body}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{copy.tools.nameColumn}</TableHead>
                <TableHead>{copy.tools.purposeColumn}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MCP_TOOLS.map(tool => (
                <TableRow key={tool}>
                  <TableCell>
                    <code className={styles.code}>{tool}</code>
                  </TableCell>
                  <TableCell>{copy.tools.descriptions[tool]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section id="skill" className={styles.section}>
          {heading('skill')}
          <p className={styles.text}>{copy.skill.body}</p>
          <CodeBlock
            language="bash"
            code={'mkdir -p your-app/.cursor/skills\ncp -R /path/to/shacdn/.cursor/skills/shacdn-style-guide your-app/.cursor/skills/'}
          />
          <ul className={styles.fileList}>
            {copy.skill.files.map(file => (
              <li key={file.path}>
                <code className={styles.code}>{file.path}</code>
                <span>{file.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="install" className={styles.section}>
          {heading('install')}
          <p className={styles.text}>{copy.install.body}</p>
          <CodeBlock
            files={[
              { name: copy.install.tokensOnly, language: 'bash', code: 'npm run shacdn:install -- /path/to/your-app' },
              {
                name: copy.install.withComponents,
                language: 'bash',
                code: 'npm run shacdn:install -- /path/to/your-app --components Button,Card,NumberField,HoldToConfirm',
              },
              {
                name: copy.install.dryRun,
                language: 'bash',
                code: 'npm run shacdn:install -- /path/to/your-app --components DatePicker --dry-run',
              },
            ]}
          />
          <p className={styles.note}>{copy.install.after}</p>
        </section>

        <section id="context" className={styles.section}>
          {heading('context')}
          <p className={styles.text}>{copy.context.body}</p>
          <ul className={styles.resourceList}>
            {copy.context.items.map(item => (
              <li key={item.href} className={styles.resource}>
                {item.href.startsWith('/components') ? (
                  <Link to={item.href} className={styles.resourceLink}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={asset(item.href)} className={styles.resourceLink}>
                    {item.label}
                  </a>
                )}
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="prompt" className={styles.section}>
          {heading('prompt')}
          <p className={styles.text}>{copy.prompt.body}</p>
          <CodeBlock language="text" code={copy.prompt.text} />
        </section>
      </article>

      <aside className={styles.toc}>
        <Scrollspy aria-label={copy.onThisPage}>
          <p className={styles.tocTitle}>
            {copy.onThisPage} <Badge variant="secondary">{SECTION_IDS.length}</Badge>
          </p>
          {SECTION_IDS.map(id => (
            <ScrollspyLink key={id} href={`#${id}`}>
              {copy.sections[id]}
            </ScrollspyLink>
          ))}
        </Scrollspy>
      </aside>
    </div>
  );
};
