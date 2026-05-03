import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Filter, ChevronRight, X,
  Tag, Info, Copy, ExternalLink, Heart,
  CheckCircle2, Target, FileText, Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';

interface LibStandard {
  standard_no: string;
  title: string;
  category: string;
  year: string;
  scope: string;
  keywords: string[];
  applicable_products: string[];
  key_requirements: string[];
  testing_methods: string[];
  related_standards: string[];
}

const STANDARDS_DB: LibStandard[] = [
  {
    standard_no: 'IS 269:2015',
    title: 'Ordinary Portland Cement – Specification',
    category: 'Cement', year: '2015',
    scope: 'Specifies requirements for Ordinary Portland Cement (OPC) grades 33, 43, and 53 used in general construction including civil engineering structures, buildings, roads, and bridges. Covers chemical composition, physical properties, and testing methods.',
    keywords: ['OPC', 'cement', 'grade 33', 'grade 43', 'grade 53', 'portland cement', 'binding material'],
    applicable_products: ['General purpose cement', 'Construction cement', 'OPC cement bags', 'Portland cement'],
    key_requirements: ['Compressive strength at 3, 7, 28 days', 'Fineness (specific surface)', 'Setting time (initial & final)', 'Soundness (Le Chatelier)', 'Chemical composition limits'],
    testing_methods: ['IS 4031 – Methods of physical tests for hydraulic cement', 'IS 4032 – Methods of chemical analysis of hydraulic cement'],
    related_standards: ['IS 12269:2013', 'IS 8112:2013', 'IS 1489-1:2015', 'IS 455:2015'],
  },
  {
    standard_no: 'IS 12269:2013',
    title: '53 Grade Ordinary Portland Cement – Specification',
    category: 'Cement', year: '2013',
    scope: 'Specifies requirements for 53 grade OPC which achieves higher strength faster. Ideal for precast concrete, prestressed concrete, high-rise buildings, and rapid construction where early strength gain is essential. Minimum 28-day compressive strength of 53 MPa.',
    keywords: ['OPC 53', 'high strength cement', 'precast concrete', 'prestressed concrete', 'high-rise buildings', 'rapid construction', 'early strength'],
    applicable_products: ['53 grade cement', 'OPC 53 bags', 'High strength cement', 'Precast cement', 'Prestressed concrete cement'],
    key_requirements: ['28-day compressive strength ≥ 53 MPa', '3-day strength ≥ 27 MPa', '7-day strength ≥ 37 MPa', 'Initial setting time ≥ 30 min', 'Soundness ≤ 10 mm'],
    testing_methods: ['IS 4031 Part 6 – Compressive strength', 'IS 4031 Part 5 – Initial and final setting time', 'IS 4031 Part 3 – Soundness'],
    related_standards: ['IS 269:2015', 'IS 8112:2013', 'IS 456:2000', 'IS 1343:2012'],
  },
  {
    standard_no: 'IS 1489-1:2015',
    title: 'Portland Pozzolana Cement (Fly Ash Based) – Specification',
    category: 'Cement', year: '2015',
    scope: 'Covers PPC made by intergrinding OPC clinker with fly ash (15–35%). Offers lower heat of hydration, improved workability, and better resistance to sulphate attack. Suitable for mass concrete, marine structures, and general construction.',
    keywords: ['PPC', 'fly ash', 'blended cement', 'pozzolana', 'portland pozzolana', 'low heat', 'sulphate resistance'],
    applicable_products: ['PPC cement bags', 'Fly ash cement', 'Blended cement', 'Mass concrete cement'],
    key_requirements: ['Fly ash content 15–35%', '28-day strength ≥ 33 MPa', 'Pozzolanic activity index ≥ 80%', 'Fineness ≥ 300 m²/kg', 'Soundness ≤ 10 mm'],
    testing_methods: ['IS 1727 – Methods of test for pozzolanic materials', 'IS 4031 – Physical tests for hydraulic cement'],
    related_standards: ['IS 269:2015', 'IS 455:2015', 'IS 456:2000', 'IS 3812-1:2003'],
  },
  {
    standard_no: 'IS 455:2015',
    title: 'Portland Slag Cement – Specification',
    category: 'Cement', year: '2015',
    scope: 'Specifies PSC made by intergrinding OPC clinker with granulated blast furnace slag (25–70%). Provides high resistance to sulphate attack and chloride penetration. Recommended for marine structures, underground construction, and sewage works.',
    keywords: ['PSC', 'slag cement', 'marine', 'blast furnace slag', 'sulphate resistant', 'chloride resistance'],
    applicable_products: ['PSC cement', 'Slag cement bags', 'Marine construction cement', 'Underground structure cement'],
    key_requirements: ['Slag content 25–70%', '28-day strength ≥ 33 MPa', 'Soundness ≤ 10 mm', 'Initial setting time ≥ 30 min'],
    testing_methods: ['IS 4031 – Physical tests', 'IS 4032 – Chemical analysis'],
    related_standards: ['IS 269:2015', 'IS 1489-1:2015', 'IS 456:2000'],
  },
  {
    standard_no: 'IS 8041:1990',
    title: 'Rapid Hardening Portland Cement – Specification',
    category: 'Cement', year: '1990',
    scope: 'Covers RHPC which gains strength rapidly, achieving in 3 days what OPC achieves in 28 days. Used where early removal of formwork is required, cold weather concreting, and emergency repair work.',
    keywords: ['RHPC', 'rapid hardening', 'early strength', 'formwork removal', 'cold weather concreting', 'emergency repair'],
    applicable_products: ['Rapid hardening cement', 'RHPC bags', 'Fast setting cement'],
    key_requirements: ['3-day strength ≥ 27 MPa', '7-day strength ≥ 37 MPa', 'Finer grinding than OPC', 'Initial setting time ≥ 30 min'],
    testing_methods: ['IS 4031 – Physical tests for hydraulic cement'],
    related_standards: ['IS 269:2015', 'IS 12269:2013'],
  },
  {
    standard_no: 'IS 6452:1989',
    title: 'High Alumina Cement for Structural Use – Specification',
    category: 'Cement', year: '1989',
    scope: 'Covers HAC with high alumina content (≥32% Al₂O₃). Provides very high early strength and excellent resistance to high temperatures and chemical attack. Used in refractory applications, furnace linings, and chemical plants.',
    keywords: ['HAC', 'refractory', 'high temperature', 'alumina cement', 'chemical resistance', 'furnace lining'],
    applicable_products: ['High alumina cement', 'Refractory cement', 'HAC bags'],
    key_requirements: ['Al₂O₃ content ≥ 32%', '24-hour strength ≥ 42 MPa', 'Resistance to temperatures up to 1000°C'],
    testing_methods: ['IS 4031 – Physical tests', 'IS 4032 – Chemical analysis'],
    related_standards: ['IS 269:2015'],
  },
  {
    standard_no: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement – Specification',
    category: 'Steel', year: '2008',
    scope: 'Specifies requirements for cold-twisted deformed bars and TMT bars used as reinforcement in concrete. Covers grades Fe415, Fe415D, Fe500, Fe500D, Fe550, Fe550D, Fe600. The "D" suffix indicates enhanced ductility for seismic zones.',
    keywords: ['TMT', 'Fe415', 'Fe500', 'Fe550', 'Fe600', 'rebar', 'deformed bars', 'HYSD', 'seismic', 'ductility'],
    applicable_products: ['TMT bars', 'Fe500 rebar', 'Fe415 bars', 'Seismic grade steel', 'Reinforcement bars'],
    key_requirements: ['Yield strength (0.2% proof stress)', 'Ultimate tensile strength', 'Elongation ≥ 14.5%', 'Bend and re-bend test', 'Rib geometry requirements', 'Chemical composition limits'],
    testing_methods: ['IS 1608 – Tensile testing of metals', 'IS 1599 – Bend test', 'IS 2770 – Methods of testing steel'],
    related_standards: ['IS 456:2000', 'IS 13920:2016', 'IS 432-1:1982', 'IS 2062:2011'],
  },
  {
    standard_no: 'IS 2062:2011',
    title: 'Hot Rolled Medium and High Tensile Structural Steel – Specification',
    category: 'Steel', year: '2011',
    scope: 'Covers hot rolled structural steel products (plates, strips, shapes, sections) in grades E165 to E650. Used for structural purposes in buildings, bridges, towers, and general engineering. Specifies chemical composition, mechanical properties, and dimensional tolerances.',
    keywords: ['structural steel', 'plates', 'sections', 'hot rolled', 'E250', 'E350', 'angles', 'channels', 'I-beams'],
    applicable_products: ['Steel plates', 'Structural sections', 'I-beams', 'Angles', 'Channels', 'H-sections'],
    key_requirements: ['Yield strength by grade (250–650 MPa)', 'Ultimate tensile strength', 'Elongation', 'Charpy impact test', 'Chemical composition (C, Mn, S, P limits)'],
    testing_methods: ['IS 1608 – Tensile testing', 'IS 1757 – Charpy impact test', 'IS 1599 – Bend test'],
    related_standards: ['IS 800:2007', 'IS 808:1989', 'IS 1786:2008'],
  },
  {
    standard_no: 'IS 800:2007',
    title: 'General Construction in Steel – Code of Practice',
    category: 'Steel', year: '2007',
    scope: 'The primary design code for steel structures in India. Covers limit state design of steel structures including beams, columns, connections, and composite construction. Incorporates modern limit state philosophy replacing the older working stress method.',
    keywords: ['steel design', 'structural', 'code of practice', 'limit state', 'beams', 'columns', 'connections', 'IS 800'],
    applicable_products: ['Steel structures', 'Industrial sheds', 'Steel bridges', 'Transmission towers', 'Steel buildings'],
    key_requirements: ['Limit state design methodology', 'Load combinations', 'Member design (tension, compression, bending)', 'Connection design (bolted, welded)', 'Stability and deflection limits'],
    testing_methods: ['Structural analysis per IS 800', 'Connection testing per IS 1024'],
    related_standards: ['IS 2062:2011', 'IS 808:1989', 'IS 875 (Parts 1–5)', 'IS 1893:2016'],
  },
  {
    standard_no: 'IS 1161:2014',
    title: 'Steel Tubes for Structural Purposes – Specification',
    category: 'Steel', year: '2014',
    scope: 'Specifies requirements for welded and seamless steel tubes used for structural purposes. Covers circular, square, and rectangular hollow sections in grades YSt 210, YSt 240, and YSt 310.',
    keywords: ['steel tubes', 'hollow sections', 'RHS', 'SHS', 'CHS', 'structural tubes', 'welded tubes'],
    applicable_products: ['Structural hollow sections', 'Steel tubes', 'Square hollow sections', 'Rectangular hollow sections'],
    key_requirements: ['Yield strength by grade', 'Tensile strength', 'Elongation', 'Dimensional tolerances', 'Hydrostatic test'],
    testing_methods: ['IS 1608 – Tensile testing', 'IS 1599 – Bend test'],
    related_standards: ['IS 2062:2011', 'IS 800:2007'],
  },
  {
    standard_no: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete – Code of Practice',
    category: 'Concrete', year: '2000',
    scope: 'The primary code for design and construction of plain and reinforced concrete structures in India. Covers materials, mix design, workmanship, inspection, and structural design. Applicable to all concrete grades from M10 to M55 and beyond.',
    keywords: ['RCC', 'concrete design', 'M20', 'M25', 'M30', 'reinforced concrete', 'plain concrete', 'code of practice', 'durability'],
    applicable_products: ['All concrete structures', 'RCC buildings', 'Concrete slabs', 'Beams', 'Columns', 'Foundations'],
    key_requirements: ['Concrete grades M10 to M55+', 'Water-cement ratio limits', 'Cover to reinforcement', 'Durability requirements by exposure class', 'Minimum cement content', 'Structural design provisions'],
    testing_methods: ['IS 516 – Compressive strength of concrete', 'IS 1199 – Sampling and slump test', 'IS 5816 – Splitting tensile strength'],
    related_standards: ['IS 10262:2019', 'IS 1786:2008', 'IS 383:2016', 'IS 9103:1999', 'IS 13920:2016'],
  },
  {
    standard_no: 'IS 10262:2019',
    title: 'Concrete Mix Proportioning – Guidelines',
    category: 'Concrete', year: '2019',
    scope: 'Provides guidelines for proportioning concrete mixes to achieve specified strength and workability. Covers normal, standard, and high performance concrete. Includes procedures for calculating water, cement, fine aggregate, and coarse aggregate quantities.',
    keywords: ['mix design', 'concrete proportioning', 'water cement ratio', 'workability', 'target strength', 'mix proportioning'],
    applicable_products: ['Ready mix concrete', 'Site mixed concrete', 'High performance concrete', 'All concrete grades'],
    key_requirements: ['Target mean strength calculation', 'Water-cement ratio selection', 'Cement content determination', 'Aggregate proportioning', 'Trial mix verification'],
    testing_methods: ['IS 516 – Compressive strength', 'IS 1199 – Workability tests', 'IS 9013 – Accelerated curing test'],
    related_standards: ['IS 456:2000', 'IS 383:2016', 'IS 9103:1999', 'IS 269:2015'],
  },
  {
    standard_no: 'IS 1343:2012',
    title: 'Prestressed Concrete – Code of Practice',
    category: 'Concrete', year: '2012',
    scope: 'Code of practice for design and construction of prestressed concrete structures. Covers pre-tensioned and post-tensioned systems, materials, design principles, and construction requirements. Applicable to bridges, long-span structures, and industrial floors.',
    keywords: ['prestressed', 'PSC', 'bridge', 'pre-tensioned', 'post-tensioned', 'tendon', 'high tensile steel', 'long span'],
    applicable_products: ['Prestressed concrete beams', 'PSC bridges', 'Prestressed slabs', 'Industrial floors'],
    key_requirements: ['Prestress losses calculation', 'Minimum concrete grade M30', 'Cover requirements', 'Anchorage zone design', 'Deflection and crack control'],
    testing_methods: ['IS 516 – Compressive strength', 'IS 1608 – Tensile testing of prestressing steel'],
    related_standards: ['IS 456:2000', 'IS 14268:1995', 'IS 6003:1983', 'IS 1786:2008'],
  },
  {
    standard_no: 'IS 13920:2016',
    title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces – Code of Practice',
    category: 'Concrete', year: '2016',
    scope: 'Specifies requirements for ductile detailing of RC structures in seismic zones III, IV, and V. Covers beams, columns, beam-column joints, shear walls, and foundations. Mandatory for buildings in high seismic zones to ensure life safety during earthquakes.',
    keywords: ['seismic', 'earthquake', 'ductile detailing', 'seismic zone', 'shear wall', 'confinement', 'IS 13920'],
    applicable_products: ['Earthquake resistant buildings', 'RC structures in seismic zones', 'Shear walls', 'Moment frames'],
    key_requirements: ['Minimum steel grade Fe415D or Fe500D', 'Confinement reinforcement in columns', 'Beam-column joint detailing', 'Shear wall design', 'Foundation requirements'],
    testing_methods: ['IS 516 – Concrete strength', 'IS 1786 – Steel testing'],
    related_standards: ['IS 456:2000', 'IS 1893-1:2016', 'IS 1786:2008', 'IS 875:2015'],
  },
  {
    standard_no: 'IS 9103:1999',
    title: 'Admixtures for Concrete – Specification',
    category: 'Concrete', year: '1999',
    scope: 'Specifies requirements for chemical admixtures used in concrete including plasticizers, superplasticizers, retarders, accelerators, and air-entraining agents. Covers performance requirements and compatibility with cement.',
    keywords: ['admixture', 'plasticizer', 'superplasticizer', 'retarder', 'accelerator', 'water reducer', 'workability'],
    applicable_products: ['Concrete admixtures', 'Superplasticizers', 'Water reducing agents', 'Retarding admixtures'],
    key_requirements: ['Water reduction ≥ 5% (plasticizer)', 'Water reduction ≥ 12% (superplasticizer)', 'Compressive strength ratio', 'Setting time limits', 'Compatibility with cement'],
    testing_methods: ['IS 516 – Compressive strength comparison', 'IS 1199 – Workability tests'],
    related_standards: ['IS 456:2000', 'IS 10262:2019', 'IS 269:2015'],
  },
  {
    standard_no: 'IS 383:2016',
    title: 'Coarse and Fine Aggregates for Concrete – Specification',
    category: 'Aggregates', year: '2016',
    scope: 'Specifies requirements for natural and crushed aggregates used in concrete. Covers grading zones for fine aggregate (Zones I–IV), nominal sizes for coarse aggregate (10mm, 20mm, 40mm), and quality requirements including deleterious substances limits.',
    keywords: ['coarse aggregate', 'fine aggregate', 'grading', 'grading zone', 'crushed stone', 'natural sand', 'sieve analysis'],
    applicable_products: ['Crushed stone aggregate', 'Natural sand', 'Manufactured sand', 'Gravel', '20mm aggregate', '10mm aggregate'],
    key_requirements: ['Grading limits by zone', 'Deleterious materials limits', 'Specific gravity 2.5–3.0', 'Water absorption ≤ 2%', 'Soundness (sodium sulphate test)', 'Alkali-silica reactivity'],
    testing_methods: ['IS 2386-1 – Particle size and shape', 'IS 2386-2 – Estimation of deleterious materials', 'IS 2386-3 – Specific gravity and absorption'],
    related_standards: ['IS 456:2000', 'IS 2386-1:2016', 'IS 2386-4:2016', 'IS 10262:2019'],
  },
  {
    standard_no: 'IS 2386-1:2016',
    title: 'Methods of Test for Aggregates for Concrete – Part 1: Particle Size and Shape',
    category: 'Aggregates', year: '2016',
    scope: 'Covers methods for determining particle size distribution (sieve analysis), flakiness index, elongation index, and angularity number of aggregates. Essential for quality control of aggregates used in concrete production.',
    keywords: ['sieve analysis', 'particle size', 'flakiness', 'elongation index', 'angularity', 'grading curve'],
    applicable_products: ['Coarse aggregate testing', 'Fine aggregate testing', 'Crushed stone QC', 'Sand grading'],
    key_requirements: ['Flakiness index ≤ 35%', 'Elongation index ≤ 45%', 'Grading within specified limits', 'Sieve sizes as per IS 460'],
    testing_methods: ['Sieve analysis procedure', 'Flakiness gauge method', 'Elongation gauge method'],
    related_standards: ['IS 383:2016', 'IS 2386-2:2016', 'IS 2386-3:2016', 'IS 2386-4:2016'],
  },
  {
    standard_no: 'IS 2386-4:2016',
    title: 'Methods of Test for Aggregates for Concrete – Part 4: Mechanical Properties',
    category: 'Aggregates', year: '2016',
    scope: 'Covers methods for determining mechanical properties of aggregates including aggregate impact value (AIV), aggregate crushing value (ACV), aggregate abrasion value, and ten percent fines value. Critical for assessing aggregate suitability for structural concrete.',
    keywords: ['impact value', 'crushing value', 'abrasion', 'AIV', 'ACV', 'ten percent fines', 'mechanical properties'],
    applicable_products: ['Structural concrete aggregate', 'Road aggregate', 'High strength concrete aggregate'],
    key_requirements: ['AIV ≤ 30% (concrete), ≤ 45% (non-structural)', 'ACV ≤ 30% (concrete)', 'Los Angeles abrasion ≤ 30%'],
    testing_methods: ['Impact testing machine method', 'Compression testing machine method', 'Los Angeles abrasion machine'],
    related_standards: ['IS 383:2016', 'IS 2386-1:2016', 'IS 456:2000'],
  },
  {
    standard_no: 'IS 1542:1992',
    title: 'Sand for Plaster – Specification',
    category: 'Aggregates', year: '1992',
    scope: 'Specifies requirements for sand used in plastering work including internal and external plaster, rendering, and floor screeds. Covers grading, deleterious substances, and organic impurities.',
    keywords: ['plaster sand', 'fine aggregate', 'masonry', 'rendering', 'floor screed', 'plastering'],
    applicable_products: ['Plastering sand', 'Rendering sand', 'Floor screed sand', 'Masonry mortar sand'],
    key_requirements: ['Grading within specified limits', 'Clay and silt ≤ 5%', 'Organic impurities (colorimetric test)', 'Soundness requirements'],
    testing_methods: ['IS 2386-1 – Sieve analysis', 'IS 2386-2 – Deleterious materials'],
    related_standards: ['IS 383:2016', 'IS 2250:1981', 'IS 1905:1987'],
  },
  {
    standard_no: 'IS 2250:1981',
    title: 'Code of Practice for Preparation and Use of Masonry Mortars',
    category: 'Masonry', year: '1981',
    scope: 'Covers preparation and use of mortars for masonry construction including brick masonry, stone masonry, and block masonry. Specifies mortar mixes, proportioning, mixing procedures, and application methods for different exposure conditions.',
    keywords: ['mortar', 'masonry', 'brick', 'cement mortar', 'lime mortar', 'masonry construction', 'pointing'],
    applicable_products: ['Brick masonry mortar', 'Stone masonry mortar', 'Block masonry mortar', 'Pointing mortar'],
    key_requirements: ['Mortar mix proportions by type', 'Water retention requirements', 'Compressive strength at 28 days', 'Workability requirements', 'Curing provisions'],
    testing_methods: ['IS 2250 – Flow table test', 'IS 516 – Compressive strength of mortar cubes'],
    related_standards: ['IS 1905:1987', 'IS 1542:1992', 'IS 269:2015', 'IS 1489-1:2015'],
  },
  {
    standard_no: 'IS 3025-1:2000',
    title: 'Methods of Sampling and Test (Physical and Chemical) for Water and Wastewater – Part 1: Sampling',
    category: 'Water', year: '2000',
    scope: 'Covers methods for sampling water used in concrete mixing and curing. Water quality directly affects concrete strength, setting time, and durability. Specifies acceptable limits for pH, chlorides, sulphates, and organic matter.',
    keywords: ['water quality', 'concrete mixing water', 'water testing', 'pH', 'chloride', 'sulphate', 'potable water'],
    applicable_products: ['Concrete mixing water', 'Curing water', 'Construction water quality'],
    key_requirements: ['pH 6–8', 'Chloride ≤ 500 mg/L (RCC), ≤ 2000 mg/L (PCC)', 'Sulphate ≤ 400 mg/L', 'Organic matter ≤ 200 mg/L', 'Turbidity ≤ 2000 mg/L'],
    testing_methods: ['pH measurement', 'Chloride titration', 'Sulphate gravimetric method', 'Turbidity measurement'],
    related_standards: ['IS 456:2000', 'IS 10262:2019'],
  },
  {
    standard_no: 'IS 14268:1995',
    title: 'Uncoated Stress Relieved Low Relaxation 7-Ply Strand for Prestressed Concrete – Specification',
    category: 'Steel', year: '1995',
    scope: 'Specifies requirements for 7-ply low relaxation prestressing strand used in post-tensioned and pre-tensioned concrete. Covers mechanical properties, relaxation characteristics, and dimensional requirements for strands of 9.53mm to 15.24mm diameter.',
    keywords: ['prestressing strand', '7-ply', 'low relaxation', 'post-tensioned', 'pre-tensioned', 'high tensile', 'tendon'],
    applicable_products: ['Prestressing strand', 'Post-tensioning tendons', 'Pre-tensioned beams', 'PSC bridge tendons'],
    key_requirements: ['Breaking load by strand size', 'Yield load (1% extension)', 'Relaxation ≤ 2.5% at 1000 hours', 'Elongation ≥ 3.5%', 'Dimensional tolerances'],
    testing_methods: ['IS 1608 – Tensile testing', 'Relaxation test at 70% UTS for 1000 hours'],
    related_standards: ['IS 1343:2012', 'IS 6003:1983', 'IS 456:2000'],
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(STANDARDS_DB.map((s) => s.category)))];

const CAT_COLORS: Record<string, string> = {
  Cement:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Steel:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Concrete:   'text-green-400 bg-green-400/10 border-green-400/20',
  Aggregates: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Masonry:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Water:      'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
};

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ std, onClose }: { std: LibStandard; onClose: () => void }) {
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();
  const fav = isFavorite(std.standard_no);
  const catColor = CAT_COLORS[std.category] || 'text-slate-400 bg-white/5 border-white/10';

  const toggleFav = () => {
    if (fav) {
      removeFavorite(std.standard_no);
      toast('Removed from favorites', { icon: '💔' });
    } else {
      addFavorite(
        {
          rank: 1, standard_no: std.standard_no, title: std.title,
          category: std.category, scope: std.scope, keywords: std.keywords,
          applicable_products: std.applicable_products,
          confidence_score: 100, dense_score: 1, bm25_score: 1,
        },
        ''
      );
      toast('Saved to favorites', { icon: '❤️' });
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(std.standard_no);
    toast.success(`Copied ${std.standard_no}`);
  };

  const Section = ({ icon: Icon, title, color, children }: any) => (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="w-[420px] shrink-0 h-full overflow-y-auto bg-[#0a0f1e] border-l border-white/5 flex flex-col"
    >
      {/* Top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 shrink-0" />

      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
              {std.standard_no}
            </span>
            <button onClick={copy} className="p-1 rounded text-slate-600 hover:text-slate-300 transition-colors" title="Copy">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-lg border', catColor)}>
            {std.category} · {std.year}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFav}
            className={clsx('p-2 rounded-xl transition-all border', fav ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-slate-600 hover:text-red-400 hover:bg-red-400/10 border-transparent')}
          >
            <Heart className={clsx('w-4 h-4', fav && 'fill-current')} />
          </button>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 border border-transparent transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-5 pb-4 shrink-0">
        <h2 className="text-base font-bold text-white leading-snug">{std.title}</h2>
      </div>

      <div className="px-5 pb-6 flex-1">
        {/* Scope */}
        <Section icon={Info} title="Scope & Description" color="text-blue-400">
          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-sm text-slate-300 leading-relaxed">{std.scope}</p>
          </div>
        </Section>

        {/* Key Requirements */}
        <Section icon={CheckCircle2} title="Key Requirements" color="text-green-400">
          <ul className="space-y-1.5">
            {std.key_requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </Section>

        {/* Applicable Products */}
        <Section icon={Layers} title="Applicable Products" color="text-orange-400">
          <div className="flex flex-wrap gap-1.5">
            {std.applicable_products.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 text-orange-300 rounded-lg">
                {p}
              </span>
            ))}
          </div>
        </Section>

        {/* Testing Methods */}
        <Section icon={Target} title="Testing Methods" color="text-purple-400">
          <ul className="space-y-1.5">
            {std.testing_methods.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* Keywords */}
        <Section icon={Tag} title="Keywords" color="text-cyan-400">
          <div className="flex flex-wrap gap-1.5">
            {std.keywords.map((k) => (
              <span key={k} className="text-xs px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/15 text-cyan-400 rounded-md">
                {k}
              </span>
            ))}
          </div>
        </Section>

        {/* Related Standards */}
        <Section icon={FileText} title="Related Standards" color="text-slate-400">
          <div className="flex flex-wrap gap-1.5">
            {std.related_standards.map((r) => (
              <span key={r} className="text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:border-blue-500/30 hover:text-blue-400 transition-colors cursor-pointer">
                {r}
              </span>
            ))}
          </div>
        </Section>

        {/* BIS Link */}
        <a
          href="https://www.bis.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 text-sm font-medium transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View on BIS Official Site
        </a>
      </div>
    </motion.div>
  );
}

// ── Main Library Page ─────────────────────────────────────────────────────────
export default function Library() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<LibStandard | null>(null);

  const filtered = STANDARDS_DB.filter((s) => {
    const matchCat = category === 'All' || s.category === category;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.standard_no.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left: table */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Standards Library</h1>
        <p className="text-slate-500 text-sm mb-5">Browse all {STANDARDS_DB.length} indexed BIS standards — click any row for full details</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by standard number, title, or keyword…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0d1424] border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === c ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3">{filtered.length} standards found</p>

        {/* Table */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[150px_1fr_110px_32px] gap-4 px-5 py-3 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Standard No.</span>
            <span>Title</span>
            <span>Category</span>
            <span />
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((s, i) => {
              const isActive = selected?.standard_no === s.standard_no;
              const catColor = CAT_COLORS[s.category] || 'text-slate-400 bg-white/5 border-white/10';
              return (
                <motion.div
                  key={s.standard_no}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => setSelected(isActive ? null : s)}
                  className={clsx(
                    'grid grid-cols-[150px_1fr_110px_32px] gap-4 px-5 py-3.5 items-center transition-all cursor-pointer group',
                    isActive ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'hover:bg-white/5'
                  )}
                >
                  <span className={clsx('font-mono text-xs font-bold', isActive ? 'text-blue-300' : 'text-blue-400')}>
                    {s.standard_no}
                  </span>
                  <div>
                    <p className={clsx('text-sm transition-colors line-clamp-1', isActive ? 'text-blue-300 font-medium' : 'text-white group-hover:text-blue-300')}>
                      {s.title}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.keywords.slice(0, 3).map((k) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-600 rounded-md">{k}</span>
                      ))}
                    </div>
                  </div>
                  <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-lg border w-fit', catColor)}>
                    {s.category}
                  </span>
                  <ChevronRight className={clsx('w-4 h-4 transition-all', isActive ? 'text-blue-400 rotate-90' : 'text-slate-700 group-hover:text-blue-400')} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No standards match your search</p>
          </div>
        )}
      </div>

      {/* Right: detail panel */}
      <AnimatePresence>
        {selected && (
          <DetailPanel key={selected.standard_no} std={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
