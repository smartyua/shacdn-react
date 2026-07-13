import { CheckCircle2, ChevronDown, Heart, ThumbsUp } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/Accordion/Accordion';
import { Avatar, AvatarFallback } from '../../../components/Avatar/Avatar';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '../../../components/Bubble/Bubble';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/Collapsible/Collapsible';
import { Item, ItemContent, ItemDescription, ItemTitle } from '../../../components/Item/Item';
import { Marker, MarkerContent } from '../../../components/Marker/Marker';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '../../../components/Message/Message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '../../../components/MessageScroller/MessageScroller';
import { PageHeader } from '../components/PageHeader';
import { ACTIVITY_MESSAGES, NOTIFICATIONS } from '../dashboardData';
import styles from '../Dashboard.module.scss';

export const ActivityPage = () => (
  <>
    <PageHeader
      title="Activity"
      lead="Real-time workspace events, team messages, and system notifications."
      meta="Feed updates automatically when live streaming is enabled in Overview"
    />

    <section className={styles.section} aria-labelledby="activity-feed-heading">
      <h2 id="activity-feed-heading" className={styles.sectionHeading}>
        Live activity feed
      </h2>
      <p className={styles.sectionLead}>System events, exports, and billing changes as they happen.</p>

      <div className={styles.twoCol}>
        <div className={styles.scrollerSurface}>
          <MessageScrollerProvider autoScroll initialScroll="end">
            <MessageScroller className={styles.scrollerRoot}>
              <MessageScrollerViewport aria-label="Activity feed">
                <MessageScrollerContent className={styles.scrollerPadding}>
                  <MessageScrollerItem messageId="today">
                    <Marker variant="separator">
                      <MarkerContent>Today</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                  {ACTIVITY_MESSAGES.map((msg) => (
                    <MessageScrollerItem key={msg.id} messageId={msg.id} scrollAnchor={msg.isUser}>
                      <Message align={msg.isUser ? 'end' : 'start'}>
                        <MessageAvatar>
                          <Avatar size="sm">
                            <AvatarFallback>{msg.initials}</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          {!msg.isUser ? <MessageHeader>{msg.author}</MessageHeader> : null}
                          <Bubble variant={msg.isUser ? 'default' : 'muted'} align={msg.isUser ? 'end' : 'start'}>
                            <BubbleContent>{msg.body}</BubbleContent>
                            {msg.id === 'a3' ? (
                              <BubbleReactions side="bottom" align="start">
                                <ThumbsUp size={14} aria-hidden />
                                <Heart size={14} aria-hidden />
                              </BubbleReactions>
                            ) : null}
                          </Bubble>
                          <MessageFooter>{msg.time}</MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="start" />
              <MessageScrollerButton direction="end" />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>

        <div className={styles.surfacePanel}>
          <h3 className={styles.panelTitle}>Quick messages</h3>
          <p className={styles.panelDescription}>Latest comment from your team channel</p>
          <div className={styles.activityFeed}>
            <MessageGroup>
              <Message align="start">
                <MessageAvatar>
                  <Avatar size="sm">
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <MessageHeader>Alex Kim</MessageHeader>
                  <BubbleGroup>
                    <Bubble variant="muted">
                      <BubbleContent>
                        Conversion chart looks clearer after the spacing pass — ship when ready.
                      </BubbleContent>
                    </Bubble>
                  </BubbleGroup>
                  <MessageFooter>Just now</MessageFooter>
                </MessageContent>
              </Message>
            </MessageGroup>
            <Marker>
              <MarkerContent>
                <CheckCircle2 size={14} aria-hidden /> All services operational · 99.9% uptime
              </MarkerContent>
            </Marker>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="activity-notifications-heading">
      <h2 id="activity-notifications-heading" className={styles.sectionHeading}>
        Notifications
      </h2>
      <p className={styles.sectionLead}>Recent alerts requiring attention or follow-up.</p>
      <div className={styles.notificationGrid}>
        {NOTIFICATIONS.map((note) => (
          <Item key={note.id} className={styles.notificationCard}>
            <ItemContent>
              <ItemTitle>{note.title}</ItemTitle>
              <ItemDescription>{note.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>

    <section className={styles.section} aria-labelledby="activity-help-heading">
      <h2 id="activity-help-heading" className={styles.sectionHeading}>
        Help &amp; filters
      </h2>
      <p className={styles.sectionLead}>Common questions about activity tracking and alert thresholds.</p>
      <div className={styles.twoCol}>
        <div className={styles.faqWrap}>
          <Accordion type="single" collapsible defaultValue="faq-1">
            <AccordionItem value="faq-1">
              <AccordionTrigger>How is activity logged?</AccordionTrigger>
              <AccordionContent>
                System events, user actions, and integrations are recorded in real time and retained for 90 days on Pro
                plans.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>Can I mute notifications?</AccordionTrigger>
              <AccordionContent>
                Yes. Configure per-channel alerts in Settings under Notifications &amp; alerts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>What triggers alerts?</AccordionTrigger>
              <AccordionContent>
                Threshold-based alerts fire when API usage, error rates, or revenue anomalies exceed configured limits in
                Settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Collapsible>
          <CollapsibleTrigger className={styles.collapsibleTrigger}>
            <span>Advanced filters</span>
            <ChevronDown size={16} aria-hidden />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className={styles.collapsibleContent}>
              Combine event type, author, and date filters to narrow the feed. Saved filters sync across your team.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  </>
);
