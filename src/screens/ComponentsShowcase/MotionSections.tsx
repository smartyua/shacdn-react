import { useState } from 'react';
import { Calendar, Mail, Search, Settings } from 'lucide-react';
import { AnimatedList } from '../../components/AnimatedList/AnimatedList';
import { AnimatedText } from '../../components/AnimatedText/AnimatedText';
import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { Dock, DockItem } from '../../components/Dock/Dock';
import { FileUpload } from '../../components/FileUpload/FileUpload';
import { InputMask } from '../../components/InputMask/InputMask';
import { NumberTicker } from '../../components/NumberTicker/NumberTicker';
import { OrbitingCircles, OrbitingCirclesItem } from '../../components/OrbitingCircles/OrbitingCircles';
import { Questionnaire } from '../../components/Questionnaire/Questionnaire';
import { Rating } from '../../components/Rating/Rating';
import { ShineBorder } from '../../components/ShineBorder/ShineBorder';
import { Sortable, SortableItem } from '../../components/Sortable/Sortable';
import { SpinningText } from '../../components/SpinningText/SpinningText';
import styles from './ComponentsShowcase.module.scss';

const SORT_LABELS: Record<string, string> = {
  design: 'Design review',
  build: 'Build',
  ship: 'Ship',
};

export const MotionSections = () => {
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(3);
  const [order, setOrder] = useState(['design', 'build', 'ship']);

  return (
    <>
      <section id="animated-list" className={styles.section}>
        <h2>Animated List</h2>
        <AnimatedList>
          <span>Invoice paid</span>
          <span>Deploy finished</span>
          <span>Review requested</span>
        </AnimatedList>
      </section>

      <section id="animated-text" className={styles.section}>
        <h2>Animated Text</h2>
        <p>
          <AnimatedText text="Fade, blur, and slide" variant="blur" />
        </p>
        <p>
          <AnimatedText text="Ship the interface" variant="typewriter" duration={1.4} />
        </p>
        <p>
          <AnimatedText text="" variant="rotate" words={['Buttons', 'Borders', 'Motion']} duration={1.6} />
        </p>
        <p>
          <AnimatedText text="Gradient headline" variant="gradient" duration={4} />
        </p>
      </section>

      <section id="apple-dock" className={styles.section}>
        <h2>Apple Dock</h2>
        <Dock>
          <DockItem label="Search">
            <Search size={18} aria-hidden />
          </DockItem>
          <DockItem label="Mail">
            <Mail size={18} aria-hidden />
          </DockItem>
          <DockItem label="Calendar">
            <Calendar size={18} aria-hidden />
          </DockItem>
          <DockItem label="Settings">
            <Settings size={18} aria-hidden />
          </DockItem>
        </Dock>
      </section>

      <section id="code-block" className={styles.section}>
        <h2>Code Block</h2>
        <CodeBlock
          language="tsx"
          highlight={[2]}
          code={'export const greet = () => {\n  return "hello";\n};'}
        />
      </section>

      <section id="file-upload" className={styles.section}>
        <h2>File Upload</h2>
        <FileUpload accept="image/*,.pdf" multiple maxFiles={4} />
      </section>

      <section id="input-mask" className={styles.section}>
        <h2>Input Mask</h2>
        <div style={{ maxWidth: 280 }}>
          <InputMask
            aria-label="Phone"
            mask="(###) ###-####"
            placeholder="(415) 555-0132"
            value={phone}
            onValueChange={masked => setPhone(masked)}
          />
        </div>
      </section>

      <section id="number-ticker" className={styles.section}>
        <h2>Number Ticker</h2>
        <p>
          <NumberTicker value={1280} prefix="$" duration={1.2} />
        </p>
      </section>

      <section id="orbiting-circles" className={styles.section}>
        <h2>Orbiting Circles</h2>
        <OrbitingCircles size={220}>
          <OrbitingCirclesItem radius={84} duration={16} path>
            <Search size={16} aria-hidden />
          </OrbitingCirclesItem>
          <OrbitingCirclesItem radius={84} duration={16} delay={-8} reverse>
            <Mail size={16} aria-hidden />
          </OrbitingCirclesItem>
          <span>Core</span>
        </OrbitingCircles>
      </section>

      <section id="questionnaire" className={styles.section}>
        <h2>Questionnaire</h2>
        <Questionnaire
          questions={[
            {
              id: 'pace',
              prompt: 'How should motion feel?',
              options: [
                { value: 'calm', label: 'Calm' },
                { value: 'snappy', label: 'Snappy' },
              ],
            },
            {
              id: 'theme',
              prompt: 'Which surface?',
              options: [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ],
            },
          ]}
        />
      </section>

      <section id="rating" className={styles.section}>
        <h2>Rating</h2>
        <Rating value={rating} onValueChange={setRating} allowHalf />
      </section>

      <section id="shine-border" className={styles.section}>
        <h2>Shine Border</h2>
        <ShineBorder>
          <div style={{ padding: '1rem 1.25rem' }}>A border that keeps moving</div>
        </ShineBorder>
      </section>

      <section id="sortable" className={styles.section}>
        <h2>Sortable</h2>
        <Sortable value={order} onValueChange={setOrder} aria-label="Release steps">
          {order.map(id => (
            <SortableItem key={id} id={id}>
              {SORT_LABELS[id]}
            </SortableItem>
          ))}
        </Sortable>
      </section>

      <section id="spinning-text" className={styles.section}>
        <h2>Spinning Text</h2>
        <SpinningText text="shacdn · motion · shacdn · motion · " />
      </section>
    </>
  );
};
