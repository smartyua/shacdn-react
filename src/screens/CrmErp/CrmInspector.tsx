import { useState } from 'react';
import { FileText, Package, Pin } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/Accordion/Accordion';
import { AspectRatio } from '../../components/AspectRatio/AspectRatio';
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '../../components/Attachment/Attachment';
import { Avatar, AvatarFallback } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Bubble, BubbleContent } from '../../components/Bubble/Bubble';
import { Button } from '../../components/Button/Button';
import { Callout, CalloutDescription, CalloutTitle } from '../../components/Callout/Callout';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Chip } from '../../components/Chip/Chip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/Collapsible/Collapsible';
import {
  ComboButton,
  ComboButtonAction,
  ComboButtonMenu,
} from '../../components/ComboButton/ComboButton';
import { DataList, DataListItem, DataListLabel, DataListValue } from '../../components/DataList/DataList';
import { DropdownMenuItem, DropdownMenuSeparator } from '../../components/DropdownMenu/DropdownMenu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/HoverCard/HoverCard';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../../components/Item/Item';
import {
  Lightbox,
  LightboxClose,
  LightboxContent,
  LightboxTrigger,
} from '../../components/Lightbox/Lightbox';
import { Marker, MarkerContent, MarkerIcon } from '../../components/Marker/Marker';
import { MentionTextarea } from '../../components/MentionTextarea/MentionTextarea';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from '../../components/Message/Message';
import { Progress } from '../../components/Progress/Progress';
import { ProgressRing } from '../../components/ProgressRing/ProgressRing';
import { Separator } from '../../components/Separator/Separator';
import { Steps, StepsItem } from '../../components/Steps/Steps';
import { Toggle } from '../../components/Toggle/Toggle';
import { TypographyMuted } from '../../components/Typography/Typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/Table/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs';
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '../../components/Timeline/Timeline';
import { useToastActions } from '../../components/Toast/Toast';

import { useCrm } from './crmContext';
import {
  ACTIVITIES,
  DEAL_STAGE_META,
  DOCUMENTS,
  INVOICES,
  NEXT_STAGE,
  ORDERS,
  OWNERS,
  QUOTES,
  SKUS,
  creditLabel,
  formatEur,
  getAccount,
  getOwner,
  getPlantLabel,
  getRegionLabel,
  getSku,
  invoiceStatusLabel,
  orderStatusLabel,
  quoteStatusLabel,
  skuAvailable,
  skuHealth,
  type Activity,
  type Deal,
  type Invoice,
  type Order,
  type Quote,
} from './crmData';
import styles from './CrmErp.module.scss';

const MENTION_USERS = OWNERS.map((owner) => ({
  id: owner.id,
  label: owner.name,
  handle: owner.id,
}));

const DESK_COMMANDS = [
  { id: 'atp', name: 'atp', description: 'Ask planning for ATP' },
  { id: 'visit', name: 'visit', description: 'Hold a site visit' },
];

const activitiesFor = (recordId: string): Activity[] =>
  ACTIVITIES.filter((activity) => activity.recordId === recordId);

const docsFor = (recordId: string) => DOCUMENTS.filter((doc) => doc.recordId === recordId);

const PlantPreview = ({ plant }: { plant: string }) => (
  <Lightbox>
    <LightboxTrigger className={styles.plantPreviewTrigger} aria-label={`Open ${getPlantLabel(plant)} layout`}>
      <AspectRatio ratio={16 / 9} className={styles.plantPreview} data-plant={plant}>
        <span className={styles.plantPreviewLabel}>{getPlantLabel(plant)}</span>
      </AspectRatio>
    </LightboxTrigger>
    <LightboxContent aria-label={`${getPlantLabel(plant)} layout`}>
      <AspectRatio ratio={16 / 9} className={styles.plantPreviewLarge} data-plant={plant}>
        <span className={styles.plantPreviewLabel}>{getPlantLabel(plant)} · hall layout</span>
      </AspectRatio>
      <LightboxClose>Close layout</LightboxClose>
    </LightboxContent>
  </Lightbox>
);

const AccountHover = ({ accountId }: { accountId: string }) => {
  const account = getAccount(accountId);
  const owner = getOwner(account.ownerId);

  return (
    <HoverCard>
      <HoverCardTrigger className={styles.dealAccount}>{account.name}</HoverCardTrigger>
      <HoverCardContent>
        <div className={styles.stack}>
          <strong>{account.name}</strong>
          <span className={styles.workbenchMeta}>
            {account.industry} · {account.site}
          </span>
          <span className={styles.workbenchMeta}>
            Owner {owner.name} · {account.paymentTerms}
          </span>
          <Badge variant={account.credit === 'hold' ? 'destructive' : 'secondary'}>{creditLabel[account.credit]}</Badge>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const ActivityFeed = ({ recordId }: { recordId: string }) => {
  const items = activitiesFor(recordId);
  if (items.length === 0) {
    return <p className={styles.workbenchMeta}>No activity logged on this record yet.</p>;
  }

  return (
    <Timeline>
      {items.map((activity) => (
        <TimelineItem key={activity.id} status={activity.status}>
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>{activity.title}</TimelineTitle>
            <TimelineDescription>{activity.detail}</TimelineDescription>
            <TimelineTime>{activity.at}</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

const Files = ({ recordId }: { recordId: string }) => {
  const files = docsFor(recordId);
  if (files.length === 0) {
    return <p className={styles.workbenchMeta}>No files attached.</p>;
  }

  return (
    <AttachmentGroup>
      {files.map((file) => (
        <Attachment key={file.id} size="sm">
          <AttachmentMedia>
            <FileText size={16} aria-hidden />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>
              {file.kind} · {file.size}
            </AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
};

const QuoteLines = ({ quote }: { quote: Quote }) => (
  <div className={styles.tableScroll}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead className={styles.numeric}>Qty</TableHead>
          <TableHead className={styles.numeric}>Unit</TableHead>
          <TableHead>ATP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quote.lines.map((line) => {
          const sku = getSku(line.skuId);
          const health = sku ? skuHealth(sku) : 'ok';
          return (
            <TableRow key={`${quote.id}-${line.skuId}`}>
              <TableCell>
                <div className={styles.stack}>
                  <strong>{sku?.sku ?? line.skuId}</strong>
                  <span className={styles.workbenchMeta}>{sku?.name}</span>
                </div>
              </TableCell>
              <TableCell className={styles.numeric}>{line.qty}</TableCell>
              <TableCell className={styles.numeric}>{formatEur(line.unitPrice)}</TableCell>
              <TableCell>
                {sku ? (
                  <Badge variant={health === 'critical' ? 'destructive' : health === 'watch' ? 'outline' : 'secondary'}>
                    {skuAvailable(sku)} {sku.unit}
                  </Badge>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

const DealInspector = ({ deal }: { deal: Deal }) => {
  const { setDeals, quotes, openApprove, openAccount, openQuote } = useCrm();
  const { addToast } = useToastActions();
  const [note, setNote] = useState('');
  const [checks, setChecks] = useState({ margin: deal.stage === 'negotiation', fat: false, legal: false });
  const account = getAccount(deal.accountId);
  const owner = getOwner(deal.ownerId);
  const quote = quotes.find((item) => item.id === deal.quoteId);
  const next = NEXT_STAGE[deal.stage];

  const advance = () => {
    if (!next) return;
    setDeals((current) => current.map((item) => (item.id === deal.id ? { ...item, stage: next, probability: Math.min(100, item.probability + 15) } : item)));
    addToast({ title: 'Stage advanced', description: `${account.name} moved to ${DEAL_STAGE_META[next].label}.` });
  };

  const impact = quote
    ? quote.lines
        .map((line) => getSku(line.skuId))
        .filter((sku): sku is NonNullable<ReturnType<typeof getSku>> => Boolean(sku && skuHealth(sku) !== 'ok'))
    : [];

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Opportunity · {deal.id.toUpperCase()}</p>
        <h2 className={styles.inspectorTitle}>{deal.title}</h2>
        <p className={styles.inspectorSub}>
          <AccountHover accountId={deal.accountId} />
          {' · '}
          {formatEur(deal.value)}
        </p>
        <div className={styles.inspectorActions}>
          <Badge variant="outline">{DEAL_STAGE_META[deal.stage].label}</Badge>
          <ComboButton size="sm">
            <ComboButtonAction onClick={advance} disabled={!next}>
              {next ? `Advance to ${DEAL_STAGE_META[next].label}` : 'Closed'}
            </ComboButtonAction>
            <ComboButtonMenu>
              <DropdownMenuItem onClick={openQuote}>Create follow-up quote</DropdownMenuItem>
              <DropdownMenuItem onClick={openApprove}>Request margin exception</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openAccount}>Open account 360</DropdownMenuItem>
            </ComboButtonMenu>
          </ComboButton>
        </div>
      </header>
      <div className={styles.inspectorBody}>
        <Steps value={deal.stage === 'lost' ? 'qualify' : deal.stage} orientation="vertical">
          <StepsItem value="qualify" title="Qualify" />
          <StepsItem value="proposal" title="Proposal" />
          <StepsItem value="negotiation" title="Negotiate" />
          <StepsItem value="commit" title="Commit" />
          <StepsItem value="won" title="Won" />
        </Steps>
        {impact.length > 0 ? (
          <Collapsible defaultOpen>
            <CollapsibleTrigger className={styles.collapseTrigger}>Supply risk on this quote</CollapsibleTrigger>
            <CollapsibleContent>
              <Callout variant="warning">
                <CalloutTitle>Material hold</CalloutTitle>
                <CalloutDescription>
                  {impact.map((sku) => `${sku.sku} (${skuAvailable(sku)} ATP)`).join(' · ')}. Convert only after ATP or
                  a Lyon borrow is confirmed.
                </CalloutDescription>
              </Callout>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
        <Marker>
          <MarkerIcon />
          <MarkerContent>{deal.nextAction}</MarkerContent>
        </Marker>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className={styles.stack}>
              <DataList orientation="vertical">
                <DataListItem>
                  <DataListLabel>Owner</DataListLabel>
                  <DataListValue>
                    {owner.name} · {owner.role}
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Close date</DataListLabel>
                  <DataListValue>{deal.closeDate}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Probability</DataListLabel>
                  <DataListValue>{deal.probability}%</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Plant / region</DataListLabel>
                  <DataListValue>
                    {getPlantLabel(deal.plant)} · {getRegionLabel(deal.region)}
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Payment terms</DataListLabel>
                  <DataListValue>{account.paymentTerms}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Next action</DataListLabel>
                  <DataListValue>{deal.nextAction}</DataListValue>
                </DataListItem>
              </DataList>
              <p className={styles.sectionLabel}>Checklist</p>
              <label className={styles.dealOwner}>
                <Checkbox
                  checked={checks.margin}
                  onChange={(event) => setChecks((current) => ({ ...current, margin: event.target.checked }))}
                />
                Margin desk signed
              </label>
              <label className={styles.dealOwner}>
                <Checkbox
                  checked={checks.fat}
                  onChange={(event) => setChecks((current) => ({ ...current, fat: event.target.checked }))}
                />
                FAT slot reserved
              </label>
              <label className={styles.dealOwner}>
                <Checkbox
                  checked={checks.legal}
                  onChange={(event) => setChecks((current) => ({ ...current, legal: event.target.checked }))}
                />
                Frame agreement attached
              </label>
            </div>
          </TabsContent>
          <TabsContent value="commercial">
            <div className={styles.stack}>
              {quote ? (
                <>
                  <div className={styles.lineMeta}>
                    <Chip size="sm" variant="outline">
                      {quote.number}
                    </Chip>
                    <Chip size="sm" variant="secondary">
                      {quoteStatusLabel[quote.status]}
                    </Chip>
                    <Chip size="sm" variant="outline">
                      {quote.margin}% margin
                    </Chip>
                    <Chip size="sm" variant="outline">
                      {quote.incoterms}
                    </Chip>
                  </div>
                  <QuoteLines quote={quote} />
                </>
              ) : (
                <p className={styles.workbenchMeta}>No quote linked. Create one from the primary action.</p>
              )}
              <Files recordId={deal.id} />
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <div className={styles.stack}>
              <ActivityFeed recordId={deal.id} />
              <p className={styles.sectionLabel}>Deal desk thread</p>
              <MessageGroup>
                <Message>
                  <MessageAvatar>
                    <Avatar size="sm">
                      <AvatarFallback>HL</AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                  <MessageContent>
                    <MessageHeader>Hanna Lind</MessageHeader>
                    ATP on HX-440 is still 1. Do not convert until Lyon confirms the borrow.
                  </MessageContent>
                </Message>
                <Message align="end">
                  <MessageContent>
                    <MessageHeader>Planning</MessageHeader>
                    Transfer request is in. Week 38 is the earliest we can promise.
                  </MessageContent>
                </Message>
              </MessageGroup>
              <div className={styles.noteRow}>
                <MentionTextarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Log a note… try @hanna or /atp"
                  rows={3}
                  aria-label="Deal note"
                  users={MENTION_USERS}
                  commands={DESK_COMMANDS}
                  onCommand={(command) => {
                    if (command.id === 'atp') {
                      addToast({ title: 'ATP requested', description: 'Planning was pinged from this note.' });
                    }
                    if (command.id === 'visit') {
                      addToast({ title: 'Visit command', description: 'Use Operations → Schedule site visit.' });
                    }
                  }}
                />
                <Button
                  size="sm"
                  disabled={!note.trim()}
                  onClick={() => {
                    addToast({ title: 'Note saved', description: 'Logged locally on this demo record.' });
                    setNote('');
                  }}
                >
                  Save note
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const QuoteInspector = ({ quote }: { quote: Quote }) => {
  const account = getAccount(quote.accountId);
  const owner = getOwner(quote.ownerId);

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Quote</p>
        <h2 className={styles.inspectorTitle}>{quote.number}</h2>
        <p className={styles.inspectorSub}>
          <AccountHover accountId={quote.accountId} /> · {formatEur(quote.value)}
        </p>
        <div className={styles.inspectorActions}>
          <Badge variant={quote.status === 'expired' ? 'destructive' : 'secondary'}>{quoteStatusLabel[quote.status]}</Badge>
          <Badge variant="outline">{quote.margin}% margin</Badge>
        </div>
      </header>
      <div className={styles.inspectorBody}>
        <DataList orientation="vertical">
          <DataListItem>
            <DataListLabel>Account</DataListLabel>
            <DataListValue>{account.name}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Owner</DataListLabel>
            <DataListValue>{owner.name}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Valid until</DataListLabel>
            <DataListValue>{quote.validUntil}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Incoterms</DataListLabel>
            <DataListValue>{quote.incoterms}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Plant</DataListLabel>
            <DataListValue>{getPlantLabel(quote.plant)}</DataListValue>
          </DataListItem>
        </DataList>
        <QuoteLines quote={quote} />
      </div>
    </>
  );
};

const OrderInspector = ({ order }: { order: Order }) => {
  const fulfillment =
    order.status === 'released'
      ? 'released'
      : order.status === 'production'
        ? 'production'
        : order.status === 'packed'
          ? 'packed'
          : 'shipped';

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Sales order</p>
        <h2 className={styles.inspectorTitle}>{order.number}</h2>
        <p className={styles.inspectorSub}>
          <AccountHover accountId={order.accountId} /> · {formatEur(order.value)}
        </p>
        <Badge variant={order.status === 'hold' ? 'destructive' : 'secondary'}>{orderStatusLabel[order.status]}</Badge>
      </header>
      <div className={styles.inspectorBody}>
        <Steps value={fulfillment} orientation="vertical">
          <StepsItem value="released" title="Released" />
          <StepsItem value="production" title="Build" />
          <StepsItem value="packed" title="Packed" />
          <StepsItem value="shipped" title="Shipped" />
        </Steps>
        <div className={styles.stack}>
          <p className={styles.sectionLabel}>Fulfillment</p>
          <div className={styles.fulfillmentRow}>
            <ProgressRing value={order.progress} size={56} aria-label={`${order.number} complete`}>
              <span className={styles.ringLabel}>{order.progress}%</span>
            </ProgressRing>
            <div className={styles.stack}>
              <Progress value={order.progress} aria-label={`${order.number} progress`} />
              <TypographyMuted>
                Promised {order.promised} · {getPlantLabel(order.plant)}
              </TypographyMuted>
            </div>
          </div>
        </div>
        <PlantPreview plant={order.plant} />
        <Files recordId={order.id} />
        <ActivityFeed recordId={order.id} />
      </div>
    </>
  );
};

const AccountInspector = ({ accountId }: { accountId: string }) => {
  const { openAccount } = useCrm();
  const account = getAccount(accountId);
  const owner = getOwner(account.ownerId);
  const openQuotes = QUOTES.filter((quote) => quote.accountId === account.id);
  const openOrders = ORDERS.filter((order) => order.accountId === account.id);

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Account 360</p>
        <h2 className={styles.inspectorTitle}>{account.name}</h2>
        <p className={styles.inspectorSub}>
          {account.industry} · {account.site}
        </p>
        <div className={styles.inspectorActions}>
          <Badge variant="outline">{account.tier}</Badge>
          <Badge variant={account.credit === 'hold' ? 'destructive' : 'secondary'}>{creditLabel[account.credit]}</Badge>
          <Button size="sm" variant="outline" onClick={openAccount}>
            Full profile
          </Button>
        </div>
      </header>
      <div className={styles.inspectorBody}>
        <Accordion type="single" collapsible defaultValue="commercial">
          <AccordionItem value="commercial">
            <AccordionTrigger>Commercial standing</AccordionTrigger>
            <AccordionContent>
              <DataList orientation="vertical">
                <DataListItem>
                  <DataListLabel>Owner</DataListLabel>
                  <DataListValue>{owner.name}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>LTM revenue</DataListLabel>
                  <DataListValue>{formatEur(account.ltmRevenue)}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Open AR</DataListLabel>
                  <DataListValue>{formatEur(account.openAr)}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Credit limit</DataListLabel>
                  <DataListValue>{formatEur(account.creditLimit)}</DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>Terms</DataListLabel>
                  <DataListValue>{account.paymentTerms}</DataListValue>
                </DataListItem>
              </DataList>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="contacts">
            <AccordionTrigger>Contacts</AccordionTrigger>
            <AccordionContent>
              <div className={styles.contactList}>
                {account.contacts.map((contact) => (
                  <Item key={contact.email}>
                    <ItemMedia>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {contact.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{contact.name}</ItemTitle>
                      <ItemDescription>
                        {contact.title} · {contact.email}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="site">
            <AccordionTrigger>Site layout</AccordionTrigger>
            <AccordionContent>
              <PlantPreview plant={account.plant} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator />
        <TypographyMuted>
          {openQuotes.length} quotes · {openOrders.length} orders on file
        </TypographyMuted>
        <ActivityFeed recordId={account.id} />
      </div>
    </>
  );
};

const SkuInspector = ({ skuId }: { skuId: string }) => {
  const sku = SKUS.find((item) => item.id === skuId);
  if (!sku) return null;
  const health = skuHealth(sku);
  const cover = Math.min(100, Math.round((sku.onHand / sku.safety) * 100));

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Inventory item</p>
        <h2 className={styles.inspectorTitle}>{sku.sku}</h2>
        <p className={styles.inspectorSub}>{sku.name}</p>
        <Badge variant={health === 'critical' ? 'destructive' : health === 'watch' ? 'outline' : 'secondary'}>
          {health === 'critical' ? 'Shortage' : health === 'watch' ? 'Below safety' : 'Covered'}
        </Badge>
      </header>
      <div className={styles.inspectorBody}>
        <div className={styles.stack}>
          <Progress value={cover} aria-label={`${sku.sku} safety cover`} />
          <span className={styles.workbenchMeta}>
            {skuAvailable(sku)} ATP · {sku.onHand} on hand · {sku.allocated} allocated · safety {sku.safety}
          </span>
        </div>
        <DataList orientation="vertical">
          <DataListItem>
            <DataListLabel>Family</DataListLabel>
            <DataListValue>{sku.family}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Plant</DataListLabel>
            <DataListValue>{getPlantLabel(sku.plant)}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Lead time</DataListLabel>
            <DataListValue>{sku.leadDays} days</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Unit</DataListLabel>
            <DataListValue>{sku.unit}</DataListValue>
          </DataListItem>
        </DataList>
        <Callout variant={health === 'critical' ? 'danger' : 'info'}>
          <CalloutTitle>
            <Package size={14} aria-hidden /> Material planning
          </CalloutTitle>
          <CalloutDescription>
            {health === 'critical'
              ? 'This SKU is blocking at least one live quote. Raise a transfer from Lyon or confirm a vendor expedite.'
              : 'Available-to-promise is calculated as on-hand minus allocated sales-order demand.'}
          </CalloutDescription>
        </Callout>
      </div>
    </>
  );
};

const InvoiceInspector = ({ invoice }: { invoice: Invoice }) => {
  const account = getAccount(invoice.accountId);

  return (
    <>
      <header className={styles.inspectorHead}>
        <p className={styles.inspectorKicker}>Receivable</p>
        <h2 className={styles.inspectorTitle}>{invoice.number}</h2>
        <p className={styles.inspectorSub}>
          <AccountHover accountId={invoice.accountId} /> · {formatEur(invoice.amount)}
        </p>
        <Badge variant={invoice.status === 'overdue' || invoice.status === 'disputed' ? 'destructive' : 'secondary'}>
          {invoiceStatusLabel[invoice.status]}
        </Badge>
      </header>
      <div className={styles.inspectorBody}>
        <DataList orientation="vertical">
          <DataListItem>
            <DataListLabel>Due</DataListLabel>
            <DataListValue>{invoice.due}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Aging bucket</DataListLabel>
            <DataListValue>{invoice.aging === 0 ? 'Current' : `${invoice.aging}+ days`}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Credit standing</DataListLabel>
            <DataListValue>{creditLabel[account.credit]}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Linked order</DataListLabel>
            <DataListValue>{invoice.orderId ? ORDERS.find((order) => order.id === invoice.orderId)?.number ?? '—' : 'Standalone'}</DataListValue>
          </DataListItem>
        </DataList>
        {invoice.status === 'overdue' ? (
          <Bubble variant="destructive">
            <BubbleContent>
              Dunning step 2 is due. New shipments for {account.name} stay on credit review until this clears.
            </BubbleContent>
          </Bubble>
        ) : (
          <Bubble variant="muted">
            <BubbleContent>No collections action on this invoice.</BubbleContent>
          </Bubble>
        )}
      </div>
    </>
  );
};

export const CrmInspector = () => {
  const { selected, deals, quotes, pinned, setPinned } = useCrm();

  const body = (() => {
    if (selected.kind === 'deal') {
      const deal = deals.find((item) => item.id === selected.id);
      return deal ? <DealInspector deal={deal} /> : null;
    }
    if (selected.kind === 'quote') {
      const quote = quotes.find((item) => item.id === selected.id);
      return quote ? <QuoteInspector quote={quote} /> : null;
    }
    if (selected.kind === 'order') {
      const order = ORDERS.find((item) => item.id === selected.id);
      return order ? <OrderInspector order={order} /> : null;
    }
    if (selected.kind === 'account') {
      return <AccountInspector accountId={selected.id} />;
    }
    if (selected.kind === 'sku') {
      return <SkuInspector skuId={selected.id} />;
    }
    const invoice = INVOICES.find((item) => item.id === selected.id);
    return invoice ? <InvoiceInspector invoice={invoice} /> : null;
  })();

  return (
    <aside className={styles.inspector} aria-label="Record inspector">
      <div className={styles.inspectorPin}>
        <Toggle pressed={pinned} onPressedChange={setPinned} size="sm" aria-label="Pin inspector">
          <Pin size={14} aria-hidden />
          Pin
        </Toggle>
      </div>
      {body}
    </aside>
  );
};
