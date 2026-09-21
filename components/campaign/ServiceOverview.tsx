import Link from '@/components/eon/PageLink';
import {ArrowUpRight} from 'lucide-react';
import {services} from '@/lib/eon/services';
import './service-overview.css';

const tiles=[
 {index:0,label:'AC duct care',image:'ac',alt:'Home wall-mounted AC and an office ceiling vent'},
 {index:1,label:'Surface protection',image:'surface',alt:'Clean countertop with a folded teal cloth'},
 {index:2,label:'Fabric protection',image:'fabric',alt:'Ivory armchair with a sage cushion'},
 {index:3,label:'Marble protection',image:'marble',alt:'Cream marble with natural veining'},
 {index:4,label:'Furniture & carpet cleaning',image:'cleaning',alt:'Upholstery extraction nozzle on a sofa'},
 {index:5,label:'Mattress cleaning',image:'mattress',alt:'Quilted mattress with a sage throw'},
 {index:6,label:'Specialty coatings',image:'specialty',alt:'Protective coating being applied to an exterior wall'},
];
export default function ServiceOverview(){return <section className="service-overview" aria-labelledby="service-overview-title"><div className="service-overview-heading"><h2 id="service-overview-title">Explore our services</h2><Link href="/service/">All services <ArrowUpRight size={16} aria-hidden="true"/></Link></div><nav className="service-overview-list" aria-label="Cleaning and protection services">{tiles.map(tile=><Link className="service-overview-link" href={`/services/${services[tile.index].slug}/`} key={tile.image}><span className="service-overview-photo"><img src={`/images/service-overview/${tile.image}.webp`} width={400} height={400} alt={tile.alt} decoding="async"/></span><span className="service-overview-label">{tile.label}<ArrowUpRight size={16} aria-hidden="true"/></span></Link>)}</nav></section>}
