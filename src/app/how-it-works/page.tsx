import Link from "next/link";

const steps = [
  ["01", "Discover your space", "Browse independent studios, sound stages, and creative rooms. Filter by type, compare spaces, and find the one that feels right."],
  ["02", "Pick your hours", "Choose when you want to make something. Check the studio details, facilities, location, and hourly rate before sending your request."],
  ["03", "Book with ease", "Send a booking request to your host. Your time is held as pending while you work out the final details together."],
  ["04", "Make something", "Show up, settle in, and create. Great ideas look good in a good room."],
];

export default function HowItWorksPage() {
  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">IT’S SIMPLE, REALLY</p><h1>Less planning.<br /><em>More making.</em></h1><p>We bring the right people and the right creative spaces together. You bring the idea.</p></div></section><section className="section wrap"><div className="process-steps">{steps.map(([number, title, copy]) => <article className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><div style={{ marginTop: 36 }}><Link className="button button-dark" href="/studios">Find your space ↗</Link></div></section></>;
}
