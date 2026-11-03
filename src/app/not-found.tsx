import Link from "next/link";
import { Aperture } from "lucide-react";

export default function NotFound() {
  return <section className="not-found"><Aperture size={38} color="#91b936" /><strong>404</strong><h1>Looks like this room is taken.</h1><p>We couldn’t find the page you were looking for.</p><Link className="button button-dark" href="/">Back to StudioSpace</Link></section>;
}
