import { useState } from 'react';
import { Download, FileText, Loader2, X } from 'lucide-react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '../../../components/Attachment/Attachment';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { DatePicker } from '../../../components/DatePicker/DatePicker';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../components/Empty/Empty';
import { Field, FieldDescription, FieldLabel } from '../../../components/Field/Field';
import { NativeSelect } from '../../../components/NativeSelect/NativeSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { useToastActions } from '../../../components/Toast/Toast';

import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

const GENERATED_REPORTS = [
  { name: 'Q2 Revenue Summary', status: 'Ready' as const, date: 'Jul 13, 2026' },
  { name: 'June Transaction Export', status: 'Ready' as const, date: 'Jul 1, 2026' },
  { name: 'Weekly Conversion Digest', status: 'Queued' as const, date: 'Jul 13, 2026' },
];

export const ReportsPage = () => {
  const { addToast } = useToastActions();
  const [reportDate, setReportDate] = useState<Date | undefined>(() => new Date());
  const [showReports, setShowReports] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowReports(true);
      addToast({ title: 'Report queued', description: 'You will be notified when ready.' });
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        lead="Generate exports for finance and operations. Attachments appear when uploads complete."
        meta="Reports queue in the background — typical completion time is under 2 minutes"
      />

      <section className={styles.section} aria-labelledby="reports-builder-heading">
        <h2 id="reports-builder-heading" className={styles.sectionHeading}>
          Report builder
        </h2>
        <p className={styles.sectionLead}>Choose a date and format, then download or share with your team.</p>

        <div className={styles.twoCol}>
          <div className={styles.surfacePanel}>
            <h3 className={styles.panelTitle}>Generate report</h3>
            <p className={styles.panelDescription}>Defaults to today as the report end date</p>
            <div className={styles.formGrid}>
              <Field>
                <FieldLabel>Report date</FieldLabel>
                <DatePicker value={reportDate} onValueChange={setReportDate} />
                <FieldDescription>Used as the report end date for aggregation</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Format</FieldLabel>
                <NativeSelect aria-label="Report format">
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                </NativeSelect>
              </Field>
            </div>
            <Button size="sm" onClick={handleGenerate} disabled={generating} className={styles.panelAction}>
              {generating ? <Loader2 size={14} aria-hidden className={styles.spinIcon} /> : <FileText size={14} aria-hidden />}
              {generating ? 'Generating…' : 'Generate'}
            </Button>
          </div>

          <div className={styles.surfacePanel}>
            <h3 className={styles.panelTitle}>Attachments</h3>
            <p className={styles.panelDescription}>Files included with the latest report run</p>
            <div className={styles.attachmentStack}>
              <Attachment state="done">
                <AttachmentMedia>
                  <FileText size={16} aria-hidden />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Q2-summary.pdf</AttachmentTitle>
                  <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction aria-label="Download">
                    <Download size={16} aria-hidden />
                  </AttachmentAction>
                  <AttachmentAction aria-label="Remove">
                    <X size={16} aria-hidden />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
              <Attachment state="uploading">
                <AttachmentMedia>
                  <Loader2 size={16} aria-hidden />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>july-metrics.csv</AttachmentTitle>
                  <AttachmentDescription>Uploading… 72%</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="reports-history-heading">
        <h2 id="reports-history-heading" className={styles.sectionHeading}>
          Generated reports
        </h2>
        <p className={styles.sectionLead}>Download ready exports or check queue status.</p>

        {showReports ? (
          <div className={styles.tableSurface}>
            <div className={styles.tableScroll}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className={styles.colHideMobile} aria-label="Actions" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {GENERATED_REPORTS.map((report) => (
                    <TableRow key={report.name}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'Ready' ? 'secondary' : 'outline'}>{report.status}</Badge>
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell className={styles.colHideMobile}>
                        {report.status === 'Ready' ? (
                          <Button variant="ghost" size="sm">
                            <Download size={14} aria-hidden />
                            Download
                          </Button>
                        ) : (
                          <span className={styles.queuedLabel}>Processing…</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className={styles.emptyWrap}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <FileText aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No reports yet</EmptyTitle>
                <EmptyDescription>
                  Generate a revenue or transaction summary to see download links here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" onClick={handleGenerate}>
                  Create report
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>
    </>
  );
};
