// ===== 3D lab: procedural biology models (three.js r128) with a 360° viewer =====
const LAB = (() => {
  let T; // THREE
  const M = (c, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .55, metalness: .05 }, o));
  const G = () => new T.Group();
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); return m; };
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const tube = (pts, r, mat, seg = 64) => new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => V(...p))), seg, r, 10, false), mat);
  const capsule = (len, r, mat) => { const g = G(); g.add(mesh(new T.CylinderGeometry(r, r, len, 24), mat)); g.add(mesh(new T.SphereGeometry(r, 24, 16), mat, 0, len / 2, 0)); g.add(mesh(new T.SphereGeometry(r, 24, 16), mat, 0, -len / 2, 0)); return g; };
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(42);

  // ---------- model builders: each returns {g, labels:[[x,y,z,text]], tick?(t)} ----------
  const B = {
    microscope() {
      const g = G(), metal = M(0x2c3e66, { metalness: .4, roughness: .35 }), dark = M(0x1d2433), glass = M(0x9fd8ff, { metalness: .2 }), steel = M(0xb9c2d0, { metalness: .6, roughness: .3 });
      g.add(mesh(new T.BoxGeometry(2.4, .3, 1.7), metal, 0, -2, 0));
      const arm = mesh(new T.TorusGeometry(1.2, .18, 16, 40, Math.PI * .9), metal, .55, -.3, 0); arm.rotation.z = -Math.PI * .55; g.add(arm);
      g.add(mesh(new T.BoxGeometry(1.6, .12, 1.3), dark, -.3, -.55, 0));
      const tubeM = mesh(new T.CylinderGeometry(.22, .22, 2, 32), metal, -.5, 1.05, 0); tubeM.rotation.z = .3; g.add(tubeM);
      const eye = mesh(new T.CylinderGeometry(.16, .2, .5, 32), dark, -.82, 2.1, 0); eye.rotation.z = .3; g.add(eye);
      const turret = mesh(new T.CylinderGeometry(.35, .35, .15, 32), steel, -.25, .1, 0); g.add(turret);
      [-.15, .15].forEach((dz, i) => { const o = mesh(new T.CylinderGeometry(.07, .1, .35, 20), steel, -.25 + dz * .6, -.15, dz); g.add(o); });
      const mir = mesh(new T.CylinderGeometry(.35, .35, .06, 32), glass, -.3, -1.45, 0); mir.rotation.x = .5; g.add(mir);
      g.add(mesh(new T.CylinderGeometry(.22, .22, .12, 24), steel, .95, -.5, .35).rotateX(Math.PI / 2));
      g.add(mesh(new T.BoxGeometry(.5, .02, .3), M(0xffffff, { transparent: true, opacity: .7 }), -.3, -.47, 0));
      return { g, labels: [[-.85, 2.4, 0, 'العدسة العينية'], [-.45, 1.2, .25, 'الأنبوبة'], [-.25, -.25, .3, 'العدسات الشيئية'], [.5, -.55, .6, 'المنضدة والشريحة'], [-.3, -1.45, .4, 'المرآة'], [1.1, -.5, .5, 'ضابط الحركة'], [1.3, .3, 0, 'الذراع'], [0, -2.1, .9, 'القاعدة']] };
    },
    animalCell() {
      const g = G();
      g.add(mesh(new T.SphereGeometry(2, 48, 32), M(0xf2c6d6, { transparent: true, opacity: .28, side: T.DoubleSide })));
      g.add(mesh(new T.SphereGeometry(.7, 32, 24), M(0x7b5ea7)));
      g.add(mesh(new T.SphereGeometry(.28, 24, 16), M(0x3d2a6b), .3, .3, .5));
      for (let i = 0; i < 6; i++) { const c = capsule(.45, .14, M(0xe0801b)); c.position.set((rnd() - .5) * 2.4, (rnd() - .5) * 2.4, (rnd() - .5) * 2.4).clampLength(.9, 1.5); c.rotation.set(rnd() * 3, rnd() * 3, 0); g.add(c); }
      for (let i = 0; i < 4; i++) { const t = mesh(new T.TorusGeometry(.35 - i * .05, .05, 8, 30, Math.PI), M(0x2b9a63), -1.1, .6 + i * .12, .4); g.add(t); }
      for (let i = 0; i < 60; i++) { const p = V((rnd() - .5) * 3, (rnd() - .5) * 3, (rnd() - .5) * 3).clampLength(.8, 1.8); g.add(mesh(new T.SphereGeometry(.035, 8, 6), M(0x1d2433), p.x, p.y, p.z)); }
      return { g, labels: [[0, 2, 0, 'الغشاء البلازمي'], [0, 0, .75, 'النواة'], [.3, .3, .8, 'النوية'], [-1.1, .8, .45, 'أجسام كولجي'], [1.4, -.6, .3, 'المايتوكوندريا'], [-.9, -1.1, .5, 'السايتوبلازم والرايبوسومات']] };
    },
    plantCell() {
      const g = G();
      g.add(new T.Mesh(new T.BoxGeometry(3.2, 2.2, 2.2), M(0x2b9a63, { transparent: true, opacity: .22 })));
      const edges = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(3.2, 2.2, 2.2)), new T.LineBasicMaterial({ color: 0x196b42 })); g.add(edges);
      g.add(mesh(new T.BoxGeometry(2.9, 1.9, 1.9), M(0xc8f0d5, { transparent: true, opacity: .2 })));
      g.add(mesh(new T.BoxGeometry(1.7, 1.3, 1.3), M(0x9fd8ff, { transparent: true, opacity: .55 }), .35, 0, 0));
      g.add(mesh(new T.SphereGeometry(.38, 24, 16), M(0x7b5ea7), -1, .45, .3));
      for (let i = 0; i < 9; i++) { const c = mesh(new T.SphereGeometry(.18, 16, 12), M(0x3fb26b), 0, 0, 0); c.scale.set(1.6, .8, .8); c.position.set(-1.25 + (i % 3) * .1, -.7 + Math.floor(i / 3) * .55, -.7 + (i % 3) * .7); g.add(c); }
      return { g, labels: [[1.6, 1.1, 1.1, 'الجدار الخلوي (سليلوز)'], [1.45, -.95, .95, 'الغشاء البلازمي'], [.35, 0, .7, 'الفجوة العصارية'], [-1, .45, .7, 'النواة'], [-1.25, -.7, .7, 'البلاستيدات الخضراء']] };
    },
    dna() {
      const g = G(), n = 26, cols = [0xd9601f, 0x2b9a63, 0x1e7fc4, 0xc2185b];
      for (let i = 0; i < n; i++) {
        const y = (i - n / 2) * .2, a = i * .45;
        const p1 = V(Math.cos(a) * .9, y, Math.sin(a) * .9), p2 = V(-Math.cos(a) * .9, y, -Math.sin(a) * .9);
        g.add(mesh(new T.SphereGeometry(.12, 16, 12), M(0x9c4012), p1.x, p1.y, p1.z)); g.add(mesh(new T.SphereGeometry(.12, 16, 12), M(0x125a8f), p2.x, p2.y, p2.z));
        const mid = p1.clone().add(p2).multiplyScalar(.5), r = mesh(new T.CylinderGeometry(.04, .04, 1.8, 8), M(cols[i % 4]), mid.x, mid.y, mid.z);
        r.quaternion.setFromUnitVectors(V(0, 1, 0), p2.clone().sub(p1).normalize()); g.add(r);
      }
      return { g, labels: [[.9, 2.4, 0, 'السلسلة الأولى'], [-.9, -2.4, 0, 'السلسلة الثانية'], [0, 0, 0, 'القواعد المرتبطة']], tick: t => g.rotation.y = t * .4 };
    },
    bacterium() {
      const g = G(), body = capsule(2.4, .7, M(0x7fd39a, { transparent: true, opacity: .55 })); body.rotation.z = Math.PI / 2; g.add(body);
      const dnaPts = []; for (let i = 0; i < 40; i++) dnaPts.push([(i / 40 - .5) * 2, Math.sin(i * 1.3) * .25, Math.cos(i * 1.7) * .25]);
      g.add(tube(dnaPts, .04, M(0x9a2a22)));
      const fl = []; for (let i = 0; i < 40; i++) fl.push([1.9 + i * .08, Math.sin(i * .5) * .25, 0]); const flag = tube(fl, .04, M(0x196b42)); g.add(flag);
      for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, x = (rnd() - .5) * 2.2; const p = mesh(new T.CylinderGeometry(.015, .015, .35, 6), M(0x196b42), x, Math.cos(a) * .82, Math.sin(a) * .82); p.lookAt(V(x, Math.cos(a) * 5, Math.sin(a) * 5)); p.rotateX(Math.PI / 2); g.add(p); }
      return { g, labels: [[0, .75, .3, 'الجدار الخلوي'], [0, 0, .3, 'المادة النووية (بلا غشاء)'], [3.2, .2, 0, 'السوط'], [-1.4, -.6, .3, 'السايتوبلازم']], tick: t => flag.rotation.x = t * 4 };
    },
    amoeba() {
      const g = G(), geo = new T.SphereGeometry(1.6, 64, 48), base = geo.attributes.position.array.slice();
      const body = mesh(geo, M(0xf4c27a, { transparent: true, opacity: .55 })); g.add(body);
      g.add(mesh(new T.SphereGeometry(.42, 24, 16), M(0x9e5307), .2, .1, .3));
      const fv = mesh(new T.SphereGeometry(.22, 16, 12), M(0x2b9a63), -.6, .4, .5); g.add(fv);
      const cv = mesh(new T.SphereGeometry(.2, 16, 12), M(0x9fd8ff, { transparent: true, opacity: .8 }), .7, -.6, .4); g.add(cv);
      return { g, labels: [[2.1, .3, 0, 'قدم كاذبة'], [.2, .1, .75, 'النواة'], [-.6, .4, .75, 'فجوة غذائية'], [.7, -.6, .65, 'فجوة متقلصة']], tick: t => {
        const p = geo.attributes.position.array;
        for (let i = 0; i < p.length; i += 3) { const x = base[i], y = base[i + 1], z = base[i + 2]; const k = 1 + .18 * Math.sin(x * 2 + t * 1.5) * Math.cos(y * 2.3 + t) + (x > 1 ? .35 * (1 + Math.sin(t * .8)) * (x - 1) : 0); p[i] = x * k; p[i + 1] = y * k; p[i + 2] = z * k; }
        geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); cv.scale.setScalar(.7 + .3 * Math.abs(Math.sin(t * 1.5)));
      } };
    },
    euglena() {
      const g = G(), body = mesh(new T.SphereGeometry(1, 48, 32), M(0x9be3b4, { transparent: true, opacity: .5 })); body.scale.set(2.2, .75, .75); g.add(body);
      const fp = []; for (let i = 0; i < 40; i++) fp.push([-2.1 - i * .06, Math.sin(i * .45) * .3, 0]); const fl = tube(fp, .035, M(0x196b42)); g.add(fl);
      g.add(mesh(new T.SphereGeometry(.12, 16, 12), M(0xd2453c), -1.7, .2, .3));
      g.add(mesh(new T.SphereGeometry(.3, 24, 16), M(0x7b5ea7), .2, 0, 0));
      for (let i = 0; i < 10; i++) { const c = mesh(new T.SphereGeometry(.15, 12, 10), M(0x2b9a63), -1.2 + i * .28, (rnd() - .5) * .6, (rnd() - .5) * .6); c.scale.set(1.8, .7, .7); g.add(c); }
      return { g, labels: [[-3.5, .4, 0, 'السوط'], [-1.7, .3, .45, 'البقعة العينية'], [.2, 0, .5, 'النواة'], [1.1, .3, .4, 'بلاستيدات خضر'], [2.1, -.3, .3, 'غلاف مرن']], tick: t => fl.rotation.x = t * 3 };
    },
    mushroom() {
      const g = G();
      const cap = mesh(new T.SphereGeometry(1.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), M(0xb5651d)); cap.scale.y = .6; cap.position.y = 1.2; g.add(cap);
      for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; const gl = mesh(new T.BoxGeometry(1.35, .14, .015), M(0xf3e2c0), Math.cos(a) * .8, 1.13, Math.sin(a) * .8); gl.rotation.y = -a; g.add(gl); }
      g.add(mesh(new T.CylinderGeometry(.28, .38, 2.2, 32), M(0xf6ead2), 0, 0, 0));
      g.add(mesh(new T.TorusGeometry(.36, .07, 12, 32), M(0xe8d5b0), 0, .6, 0).rotateX(Math.PI / 2));
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; g.add(tube([[0, -1.1, 0], [Math.cos(a) * .6, -1.5, Math.sin(a) * .6], [Math.cos(a + .4) * 1.4, -1.8, Math.sin(a + .4) * 1.4]], .025, M(0xffffff))); }
      return { g, labels: [[0, 2.15, 0, 'القلنسوة'], [1.1, 1.05, .6, 'الصفائح (تنتج الجراثيم)'], [.35, .6, .2, 'الحلقة'], [.35, -.3, .2, 'الساق'], [1.4, -1.8, .6, 'الخيوط الفطرية']] };
    },
    eye() {
      const g = G();
      g.add(mesh(new T.SphereGeometry(2, 64, 48, 0, Math.PI * 1.5), M(0xf7f4ee, { side: T.DoubleSide })));
      g.add(mesh(new T.SphereGeometry(1.92, 64, 48, 0, Math.PI * 1.5), M(0xd2453c, { side: T.DoubleSide })));
      g.add(mesh(new T.SphereGeometry(1.86, 64, 48, 0, Math.PI * 1.5), M(0xe0801b, { side: T.DoubleSide })));
      const cornea = mesh(new T.SphereGeometry(.95, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3), M(0xbfe6ff, { transparent: true, opacity: .45 }), 0, 0, 1.38); cornea.rotation.x = Math.PI / 2; g.add(cornea);
      g.add(mesh(new T.TorusGeometry(.55, .22, 16, 48), M(0x1e7fc4), 0, 0, 1.75));
      const lens = mesh(new T.SphereGeometry(.6, 32, 24), M(0xd4ecff, { transparent: true, opacity: .75 }), 0, 0, 1.25); lens.scale.z = .5; g.add(lens);
      const nerve = mesh(new T.CylinderGeometry(.3, .35, 1.6, 24), M(0xf6c16b), 0, 0, -2.6); nerve.rotation.x = Math.PI / 2; g.add(nerve);
      g.add(mesh(new T.SphereGeometry(.12, 16, 12), M(0xe6b800), .3, .4, -1.82));
      return { g, labels: [[0, 0, 2.3, 'القرنية'], [.65, .3, 1.8, 'القزحية'], [0, 0, 1.8, 'البؤبؤ'], [0, -.5, 1.3, 'العدسة'], [1.9, .5, 0, 'الصلبة'], [1.3, -1.2, 0, 'المشيمية'], [-1.2, -1.2, .4, 'الشبكية'], [.3, .45, -1.8, 'الشائبة الصفراء'], [0, 0, -3.3, 'العصب البصري']] };
    },
    neuron() {
      const g = G(), body = mesh(new T.SphereGeometry(.8, 32, 24), M(0x8f84e0)); body.position.x = -2.6; g.add(body);
      g.add(mesh(new T.SphereGeometry(.3, 24, 16), M(0x30288a), -2.6, .1, .55));
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + .3; g.add(tube([[-2.6 + Math.cos(a) * .7, Math.sin(a) * .7, 0], [-2.6 + Math.cos(a) * 1.4, Math.sin(a) * 1.4, (rnd() - .5)], [-2.6 + Math.cos(a + .3) * 2, Math.sin(a + .3) * 2, (rnd() - .5) * 1.5]], .06, M(0x8f84e0))); }
      g.add(tube([[-1.8, 0, 0], [0, .1, 0], [2.6, 0, 0]], .1, M(0x6b5fc9)));
      for (let i = 0; i < 4; i++) g.add(mesh(new T.CylinderGeometry(.22, .22, .7, 24), M(0xece8ff), -1.1 + i * .95, .05, 0).rotateZ(Math.PI / 2));
      for (let i = 0; i < 5; i++) { const a = (i - 2) * .35; g.add(tube([[2.6, 0, 0], [3.2, Math.sin(a) * .7, Math.cos(a * 2) * .3]], .05, M(0x6b5fc9))); g.add(mesh(new T.SphereGeometry(.1, 12, 8), M(0xd9a521), 3.22, Math.sin(a) * .7, Math.cos(a * 2) * .3)); }
      const imp = mesh(new T.SphereGeometry(.16, 16, 12), M(0xffcc33, { emissive: 0xffaa00, emissiveIntensity: .8 })); g.add(imp);
      return { g, labels: [[-2.6, .9, 0, 'جسم الخلية'], [-2.6, .1, .9, 'النواة'], [-4.4, .8, 0, 'التفرعات'], [.4, .35, 0, 'المحور'], [-1.1, -.35, .25, 'غلاف المحور'], [3.3, .8, 0, 'التشجرات']], tick: t => { const k = (t * .5) % 1; imp.position.set(-1.8 + k * 4.6, .25, 0); } };
    },
    virus() {
      const g = G(), cap = mesh(new T.IcosahedronGeometry(1.4, 0), M(0xc5cae9, { transparent: true, opacity: .55, flatShading: true })); g.add(cap);
      g.add(new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(1.4, 0)), new T.LineBasicMaterial({ color: 0x283593 })));
      const pts = []; for (let i = 0; i < 80; i++) { const a = i * .5; pts.push([Math.cos(a) * .5 * Math.sin(i / 80 * 3.14), (i / 80 - .5) * 1.6, Math.sin(a) * .5 * Math.sin(i / 80 * 3.14)]); }
      g.add(tube(pts, .05, M(0xc2185b), 200));
      const ico = new T.IcosahedronGeometry(1.4, 0).attributes.position, seen = new Set();
      for (let i = 0; i < ico.count; i++) { const v = V(ico.getX(i), ico.getY(i), ico.getZ(i)), k = v.toArray().map(n => n.toFixed(2)).join(); if (seen.has(k)) continue; seen.add(k);
        const d = v.clone().normalize(); const s = mesh(new T.CylinderGeometry(.04, .04, .6, 8), M(0x283593)); s.position.copy(d.clone().multiplyScalar(1.6)); s.quaternion.setFromUnitVectors(V(0, 1, 0), d); g.add(s);
        g.add(mesh(new T.SphereGeometry(.1, 12, 8), M(0xd9a521), ...d.clone().multiplyScalar(1.92).toArray())); }
      return { g, labels: [[1.1, .8, .6, 'الجدار (الغلاف البروتيني)'], [0, .8, 0, 'الحمض النووي DNA أو RNA'], [0, 1.95, 0, 'زوائد للتثبيت']], tick: t => g.rotation.y = t * .3 };
    },
    heart() {
      const g = G(), red = M(0xc62828), blue = M(0x1e5fa8);
      const lv = mesh(new T.SphereGeometry(1, 40, 32), red, .45, -.4, 0); lv.scale.set(1, 1.35, .95); g.add(lv);
      const rv = mesh(new T.SphereGeometry(.9, 40, 32), M(0xe05a5a), -.5, -.3, .15); rv.scale.set(1, 1.2, .9); g.add(rv);
      g.add(mesh(new T.SphereGeometry(.55, 32, 24), M(0xd84343), .55, .95, -.1));
      g.add(mesh(new T.SphereGeometry(.6, 32, 24), M(0x4f86c6), -.65, .95, 0));
      g.add(tube([[.15, .9, 0], [.2, 2, 0], [.9, 2.4, 0], [1.4, 1.9, 0], [1.5, .9, -.3]], .3, M(0xe53935)));
      g.add(tube([[-.2, .6, .5], [-.1, 1.6, .7], [.6, 1.9, .9]], .25, M(0x3f6fb5)));
      g.add(tube([[-.9, 1.3, 0], [-1, 2.5, 0]], .26, blue));
      g.add(tube([[-.9, .6, -.2], [-1.1, -.6, -.4], [-1.1, -1.6, -.5]], .24, blue));
      return { g, labels: [[.6, 1.4, -.1, 'الأذين الأيسر'], [-.75, 1.45, 0, 'الأذين الأيمن'], [.9, -.6, .8, 'البطين الأيسر'], [-.6, -.5, .95, 'البطين الأيمن'], [.9, 2.45, 0, 'الأبهر (الأورطي)'], [.6, 1.9, 1, 'الشريان الرئوي'], [-1, 2.5, 0, 'الوريد الأجوف العلوي'], [-1.1, -1.6, -.5, 'الوريد الأجوف السفلي']],
        tick: t => { const s = 1 + .05 * Math.max(0, Math.sin(t * 6.3)) ; lv.scale.set(s, 1.35 * s, .95 * s); rv.scale.set(s, 1.2 * s, .9 * s); } };
    },
    ecoPyr() {
      const g = G(), cols = [0x2e7d32, 0xe0801b, 0xc2185b, 0x4a3fb5], names = ['المنتجات (النباتات)', 'مستهلكات أولية (عاشبة)', 'مستهلكات ثانوية (لاحمة)', 'مستهلكات ثالثية'], labs = [];
      for (let i = 0; i < 4; i++) {
        const r1 = 2.2 - i * .5, r2 = 2.2 - (i + 1) * .5 + (i === 3 ? 0 : 0), h = .75;
        const geo = new T.CylinderGeometry(Math.max(r2, .08), r1, h, 4, 1); geo.rotateY(Math.PI / 4);
        g.add(mesh(geo, M(cols[i], { roughness: .4 }), 0, -1.4 + i * (h + .06), 0));
        labs.push([r1 * .72, -1.4 + i * (h + .06), r1 * .72, names[i]]);
      }
      const sun = mesh(new T.SphereGeometry(.35, 24, 16), M(0xffcc33, { emissive: 0xffaa00, emissiveIntensity: .9 }), -2.8, 2.3, 0); g.add(sun);
      labs.push([-2.8, 2.85, 0, 'الشمس'], [0, 2.1, 0, 'الطاقة تتناقص صعودًا']);
      return { g, labels: labs, tick: t => g.rotation.y = t * .3 };
    },
    greenhouse() {
      const g = G();
      g.add(mesh(new T.SphereGeometry(1.5, 48, 32), M(0x1e7fc4, { roughness: .7 })));
      for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, b = Math.acos(2 * rnd() - 1), c = mesh(new T.SphereGeometry(.28, 12, 8), M(0x2e7d32), 1.48 * Math.sin(b) * Math.cos(a), 1.48 * Math.cos(b), 1.48 * Math.sin(b) * Math.sin(a)); c.scale.set(1, .35, 1); g.add(c); }
      g.add(mesh(new T.SphereGeometry(2.05, 48, 32), M(0xbfe6ff, { transparent: true, opacity: .22, side: T.DoubleSide })));
      for (let i = 0; i < 18; i++) { const a = rnd() * 6.28, b = Math.acos(2 * rnd() - 1), r = 1.65 + rnd() * .3; g.add(mesh(new T.SphereGeometry(.07, 8, 6), M(0xe0801b, { emissive: 0xe0801b, emissiveIntensity: .7 }), r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a))); }
      for (let i = 0; i < 3; i++) { const ar = mesh(new T.CylinderGeometry(.05, .05, 1.2, 8), M(0xffcc33, { emissive: 0xffaa00, emissiveIntensity: .8 }), -3 + i * .35, 2.2 - i * .6, 0); ar.rotation.z = -Math.PI / 3.2; g.add(ar); }
      return { g, labels: [[-3, 2.9, 0, 'أشعة الشمس'], [0, 2.3, 0, 'الغلاف الجوي (CO₂ وغازات)'], [1.9, .9, .9, 'حرارة محبوسة'], [0, -1.7, 0, 'سطح الأرض']], tick: t => g.rotation.y = t * .25 };
    },
    fish() {
      const g = G(), body = mesh(new T.SphereGeometry(1, 40, 28), M(0x6fa8c9, { roughness: .35 })); body.scale.set(2.2, .85, .55); g.add(body);
      const belly = mesh(new T.SphereGeometry(1, 32, 20), M(0xdfeef7), 0, -.25, 0); belly.scale.set(2.0, .5, .5); g.add(belly);
      const tail = mesh(new T.ConeGeometry(.9, 1.2, 3), M(0x2f6f95), -2.55, 0, 0); tail.rotation.z = Math.PI / 2; tail.scale.set(1, 1, .15); g.add(tail);
      const dors = mesh(new T.ConeGeometry(.5, 1, 3), M(0x2f6f95), .1, .95, 0); dors.scale.set(1.6, 1, .12); g.add(dors);
      [-1, 1].forEach(z => { const f = mesh(new T.ConeGeometry(.3, .8, 3), M(0x3d86ad), .9, -.55, z * .42); f.rotation.set(.4 * z, 0, 2.2); f.scale.set(1, 1, .15); g.add(f); const pv = mesh(new T.ConeGeometry(.25, .6, 3), M(0x3d86ad), -.3, -.7, z * .3); pv.rotation.set(.4 * z, 0, 2.6); pv.scale.set(1, 1, .15); g.add(pv);
        g.add(mesh(new T.SphereGeometry(.14, 16, 12), M(0xffffff), 1.75, .2, z * .3)); g.add(mesh(new T.SphereGeometry(.07, 12, 8), M(0x111111), 1.86, .2, z * .34)); });
      g.add(mesh(new T.TorusGeometry(.55, .05, 8, 24, Math.PI), M(0xd96a6a), 1.1, 0, .3).rotateZ(Math.PI / 2));
      const bl = mesh(new T.SphereGeometry(.55, 24, 16), M(0xffe6b3, { transparent: true, opacity: .8 }), -.1, .1, 0); bl.scale.set(1.5, .6, .5); g.add(bl);
      g.add(tube([[1.5, .15, .5], [.2, .12, .53], [-1.6, .08, .4]], .02, M(0x1d2433)));
      return { g, labels: [[1.9, .5, .4, 'العين (بلا أجفان)'], [1.05, .55, .6, 'الغطاء الخيشومي'], [.1, .5, .8, 'الخط الجانبي'], [-.1, .35, 0, 'مثانة السباحة'], [.1, 1.6, 0, 'الزعنفة الظهرية'], [.9, -1.1, .5, 'الزعنفة الصدرية'], [-3.3, .3, 0, 'الزعنفة الذيلية']], tick: t => { tail.rotation.y = Math.sin(t * 3) * .3; } };
    },
    flower() {
      const g = G();
      g.add(mesh(new T.CylinderGeometry(.08, .1, 2.2, 12), M(0x3a8f4a), 0, -1.8, 0));
      g.add(mesh(new T.SphereGeometry(.28, 20, 14), M(0x5aa84a), 0, -.55, 0));
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28, s = mesh(new T.SphereGeometry(.4, 12, 8), M(0x3a8f4a), Math.cos(a) * .35, -.5, Math.sin(a) * .35); s.scale.set(.5, 1.2, .25); s.rotation.set(Math.sin(a) * .6, 0, -Math.cos(a) * .6); g.add(s); }
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28 + .3, p = mesh(new T.SphereGeometry(.7, 20, 14), M(0xe8588a, { roughness: .4 }), Math.cos(a) * .8, .2, Math.sin(a) * .8); p.scale.set(.55, 1, .22); p.rotation.set(Math.sin(a) * .8, -a, -Math.cos(a) * .0); p.lookAt(0, 1.6, 0); g.add(p); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; const f = mesh(new T.CylinderGeometry(.025, .025, 1.1, 8), M(0xe6e6a0), Math.cos(a) * .45, .35, Math.sin(a) * .45); f.rotation.set(Math.sin(a) * .22, 0, -Math.cos(a) * .22); g.add(f); g.add(mesh(new T.SphereGeometry(.1, 12, 8), M(0xe6b800), Math.cos(a) * .55, .95, Math.sin(a) * .55)); }
      g.add(mesh(new T.CylinderGeometry(.04, .06, .9, 10), M(0x8fd18f), 0, .25, 0));
      g.add(mesh(new T.SphereGeometry(.22, 16, 12), M(0x6bbf6b), 0, -.18, 0));
      g.add(mesh(new T.SphereGeometry(.11, 12, 8), M(0xd9a521), 0, .75, 0));
      return { g, labels: [[1.3, -.5, 0, 'الكأس'], [1.2, .9, .6, 'التويج'], [.7, 1.1, .5, 'الطلع (المتك)'], [0, 1.2, 0, 'الميسم'], [.35, -.18, .2, 'المبيض'], [0, -2.9, 0, 'حامل زهري']], tick: t => g.rotation.y = t * .35 };
    },
    root() {
      const g = G(), brown = M(0xa86f3c);
      g.add(tube([[0, 1.8, 0], [0, .6, 0], [.1, -1, 0], [0, -2.2, 0]], .17, brown));
      [[-1, .9, 1.3, .3], [1, .5, 1.6, -.3], [-1, -.3, 1.8, .4], [1, -1, 1.5, -.5], [-.3, -1.5, 1.1, .6]].forEach(([dx, y, L, dz]) => {
        g.add(tube([[0, y, 0], [dx * L * .5, y - .3, dz], [dx * L, y - .9, dz * 2]], .07, brown));
        for (let k = 0; k < 3; k++) { const t = .35 + k * .22; g.add(mesh(new T.SphereGeometry(.19 + rnd() * .06, 16, 12), M(0xf1e3b5, { roughness: .5 }), dx * L * t, y - .25 - .8 * t * t, dz * t * 1.6)); } });
      for (let i = 0; i < 70; i++) { const y = -2 + rnd() * 3.4, a = rnd() * 6.28; g.add(tube([[Math.cos(a) * .15, y, Math.sin(a) * .15], [Math.cos(a) * .35, y - .05, Math.sin(a) * .35]], .012, M(0xe9dcc2), 6)); }
      g.add(mesh(new T.ConeGeometry(.2, .35, 14), M(0x7a4e26), 0, -2.4, 0).rotateX(Math.PI));
      return { g, labels: [[.6, 1.8, 0, 'الجذر الوتدي (الأولي)'], [1.9, -.3, .5, 'جذور جانبية'], [.9, .2, .6, 'عقد بكتريا الرايزوبيوم'], [.5, -1.2, 0, 'الشعيرات الجذرية'], [0, -2.8, 0, 'القلنسوة']], tick: t => g.rotation.y = t * .3 };
    },

  };

  const LIST = [
    { g: 1, id: 'microscope', t: 'المجهر الضوئي المركّب', d: 'يمر الضوء من المرآة عبر العيّنة ثم العدسات الشيئية والعينية فتظهر الصورة مكبّرة. قوة التكبير = تكبير العينية × تكبير الشيئية.', c: '#0e7c86' },
    { g: 1, id: 'animalCell', t: 'الخلية الحيوانية', d: 'يحيط بها الغشاء البلازمي، وفيها النواة التي تسيطر على فعالياتها، والمايتوكوندريا مصنع الطاقة.', c: '#7a3fa0' },
    { g: 1, id: 'plantCell', t: 'الخلية النباتية', d: 'تتميز من الحيوانية بالجدار الخلوي والبلاستيدات الخضراء والفجوة العصارية الكبيرة.', c: '#2b9a63' },
    { g: 1, id: 'dna', t: 'الحمض النووي DNA', d: 'سلسلتان ملتفتان حلزونيًا ترتبطان بقواعد، وتحملان الصفات الوراثية داخل الكروموسومات.', c: '#d9601f' },
    { g: 2, id: 'bacterium', t: 'البكتريا العصوية', d: 'من مملكة البدائيات: المادة النووية منتشرة في السايتوبلازم دون غشاء نووي، وبعضها له سوط للحركة.', c: '#0e7c86' },
    { g: 2, id: 'amoeba', t: 'الأميبا', d: 'من اللحميات: تتحرك وتتغذى بالأقدام الكاذبة، وتطرح الفضلات بالفجوة المتقلصة. شاهد جسمها يتغيّر باستمرار!', c: '#e0801b' },
    { g: 2, id: 'euglena', t: 'اليوغلينا', d: 'من السوطيات: تتحرك بالسوط نحو الضوء بمساعدة البقعة العينية، وتصنع غذاءها بالبلاستيدات الخضر.', c: '#2b9a63' },
    { g: 2, id: 'mushroom', t: 'فطر المشروم', d: 'من الفطريات البازيدية: ينتج الجراثيم في صفائح تحت القلنسوة، وتمتص الخيوط الفطرية الغذاء من التربة.', c: '#a3479f' },
    { g: 3, id: 'eye', t: 'العين البشرية', d: 'مقطع يكشف طبقات العين الثلاث (الصلبة والمشيمية والشبكية) والعدسة والقزحية والعصب البصري.', c: '#00897b' },
    { g: 3, id: 'neuron', t: 'الخلية العصبية', d: 'يسري الإيعاز العصبي من جسم الخلية عبر المحور إلى التشجرات. لاحظ النبضة الذهبية تتحرك!', c: '#4a3fb5' },
    { g: 3, id: 'heart', t: 'القلب', d: 'أربع ردهات: أذينان وبطينان. الأحمر دم مؤكسج والأزرق غير مؤكسج. شاهده ينبض.', c: '#c2185b' },
    { g: 6, id: 'cell6', t: 'الخلية حقيقية النواة', d: 'النواة والمايتوكوندريا (بيوت الطاقة) والغشاء البلازمي؛ دوّرها وتعرّف مواقع العضيات كما في الفصل الأول.', c: '#4a3fb5' },
    { g: 6, id: 'plant6', t: 'الخلية النباتية والبلاستيدات', d: 'جدار سيليلوزي وبلاستيدات خضراء وفجوة عصارية كبيرة: أهم فروق الخلية النباتية عن الحيوانية.', c: '#2b9a63' },
    { g: 6, id: 'dna6', t: 'جزيء DNA', d: 'حلزون مزدوج: سكر وفوسفات في الجانبين وقواعد متزاوجة A–T و G–C في الوسط (واطسن وكريك 1953).', c: '#d9601f' },
    { g: 6, id: 'neuron6', t: 'العصبونة (النسيج العصبي)', d: 'جسم الخلية والتشجرات والمحور المحاط بالغلاف النخاعيني. شاهد السيال العصبي يسري!', c: '#c2185b' },
    { g: 6, id: 'bact6', t: 'الخلية بدائية النواة', d: 'البكتيريا: منطقة نووية دون غشاء نووي، رايبوسومات، جدار صلب وسوط.', c: '#0e7c86' },
    { g: 3, id: 'virus', t: 'الفيروس (الراشح)', d: 'جدار بروتيني يحيط بالحمض النووي، وزوائد تثبّته على الخلية. ليس له نواة ولا عضيات.', c: '#283593' },
    { g: 4, id: 'ecoPyr', t: 'الهرم البيئي (هرم الطاقة)', d: 'منتجات عند القاعدة ثم مستهلكات؛ تتناقص الطاقة في كل مستوى، ولا ينقلب هرم الطاقة أبدًا.', c: '#2e7d32' },
    { g: 4, id: 'greenhouse', t: 'الاحتباس الحراري', d: 'تدخل أشعة الشمس فتتحول إلى حرارة، وغاز CO₂ والغازات الأخرى تحبس الحرارة في الغلاف الجوي فترتفع حرارة الأرض.', c: '#e0801b' },
    { g: 4, id: 'fish', t: 'السمكة العظمية', d: 'جسم مغزلي انسيابي، زعانف مفردة وزوجية، خياشيم تحت الغطاء الخيشومي، مثانة سباحة وخط جانبي.', c: '#1e7fc4' },
    { g: 4, id: 'flower', t: 'الزهرة النموذجية', d: 'أربع حلقات من الخارج للداخل: الكأس، التويج، الطلع (الأسدية)، المتاع (المدقة).', c: '#c2185b' },
    { g: 4, id: 'root', t: 'جذر الباقلاء وعقده', d: 'جذر وتدي عليه عقد صغيرة فيها بكتريا الرايزوبيوم تثبّت النتروجين الجوي، وشعيرات جذرية لامتصاص الماء.', c: '#0e7c86' },
  ];

  B.cell6 = B.animalCell; B.plant6 = B.plantCell; B.dna6 = B.dna; B.neuron6 = B.neuron; B.bact6 = B.bacterium;
  let raf = 0, cleanup = null;
  function load(cb) {
    if (window.THREE) { T = window.THREE; return cb(); }
    const s = document.createElement('script'); s.src = window.THREE_SRC; s.onload = () => { T = window.THREE; cb(); };
    s.onerror = () => cb(new Error('load')); document.head.appendChild(s);
  }
  function open(host, id, opts = {}) {
    stop();
    load(err => {
      if (err || !window.THREE) { host.innerHTML = '<p class="lab-err">تعذّر تحميل محرك الرسوم ثلاثية الأبعاد.</p>'; return; }
      const cv = document.createElement('canvas'); let gl;
      try { gl = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { host.innerHTML = '<p class="lab-err">جهازك لا يدعم الرسوم ثلاثية الأبعاد (WebGL).</p>'; return; }
      host.innerHTML = ''; host.appendChild(cv); const lab = document.createElement('div'); lab.className = 'lab-labels'; host.appendChild(lab);
      gl.setPixelRatio(Math.min(2, devicePixelRatio || 1));
      const sc = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 100);
      sc.add(new T.HemisphereLight(0xffffff, 0x8899bb, .9)); const dl = new T.DirectionalLight(0xffffff, .8); dl.position.set(4, 6, 5); sc.add(dl); const dl2 = new T.DirectionalLight(0xffffff, .35); dl2.position.set(-5, -2, -4); sc.add(dl2);
      const m = B[id](); sc.add(m.g);
      const box = new T.Box3().setFromObject(m.g), size = box.getSize(V()).length(), ctr = box.getCenter(V()); m.g.position.sub(ctr);
      m.labels.forEach(l => { l[0] -= ctr.x; l[1] -= ctr.y; l[2] -= ctr.z; });
      let th = .6, ph = 1.25, rad = size * 1.25, auto = opts.auto !== false, showL = opts.labels !== false, drag = null, pinch = 0;
      const els = m.labels.map(l => { const e = document.createElement('span'); e.textContent = l[3]; lab.appendChild(e); return e; });
      // leader lines: a dot on the part and a line to its label, so a label pushed aside still points at what it names
      const NS = 'http://www.w3.org/2000/svg', svgL = document.createElementNS(NS, 'svg'); svgL.setAttribute('class', 'lab-lines'); svgL.setAttribute('aria-hidden', 'true'); lab.insertBefore(svgL, lab.firstChild);
      const lines = els.map(() => { const g = document.createElementNS(NS, 'g'), ln = document.createElementNS(NS, 'line'), dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '3.5'); g.append(ln, dot); svgL.appendChild(g); return { g, ln, dot }; });
      const ctl = { toggleAuto: () => (auto = !auto), toggleLabels: () => { showL = !showL; lab.hidden = !showL; return showL; }, reset: () => { th = .6; ph = 1.25; rad = size * 1.25; } };
      const pts = new Map();
      cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); auto = false; if (opts.onInteract) opts.onInteract(); });
      cv.addEventListener('pointermove', e => { if (!pts.has(e.pointerId)) return; const [px, py] = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 1) { th -= (e.clientX - px) * .008; ph = Math.min(3.0, Math.max(.15, ph - (e.clientY - py) * .008)); }
        else if (pts.size === 2) { const a = [...pts.values()], d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); if (pinch) rad = Math.min(size * 3, Math.max(size * .5, rad * pinch / d)); pinch = d; } });
      const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      cv.addEventListener('wheel', e => { e.preventDefault(); rad = Math.min(size * 3, Math.max(size * .5, rad * (1 + e.deltaY * .001))); }, { passive: false });
      const t0 = performance.now(), tmp = V();
      const loop = () => {
        raf = requestAnimationFrame(loop); const t = (performance.now() - t0) / 1000;
        const w = host.clientWidth, h = host.clientHeight; if (cv.width !== Math.floor(w * gl.getPixelRatio()) || cv.height !== Math.floor(h * gl.getPixelRatio())) { gl.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
        if (auto) th += .004; if (m.tick) m.tick(t);
        cam.position.set(rad * Math.sin(ph) * Math.sin(th), rad * Math.cos(ph), rad * Math.sin(ph) * Math.cos(th)); cam.lookAt(0, 0, 0);
        gl.render(sc, cam);
        if (showL) {
          // project every label, keep it inside the stage, then push overlapping labels apart vertically
          const P = m.labels.map((l, i) => { tmp.set(l[0], l[1], l[2]).applyMatrix4(m.g.matrixWorld).project(cam); const e = els[i];
            if (!e._w) { e._w = e.offsetWidth; e._h = e.offsetHeight; }
            const hw = e._w / 2 + 4, hh = e._h / 2 + 4;
            const rx = (tmp.x * .5 + .5) * w, ry = (-tmp.y * .5 + .5) * h;
            // callout: the label sits beside its part (on the side away from the model's centre), never on top of it
            const dir = rx < w / 2 ? -1 : 1, clampX = v => Math.min(w - hw, Math.max(hw, v));
            const x = clampX(rx + dir * (hw + 14)); // near the stage edge the clamp may leave the label on its own part; that still names it
            return { e, ax: Math.min(w - 5, Math.max(5, rx)), ay: Math.min(h - 5, Math.max(5, ry)), x, y: Math.min(h - hh, Math.max(hh, ry)), f: tmp.z < 1 }; });
          const S = P.filter(p => p.f).sort((a, b) => a.y - b.y);
          for (let i = 1; i < S.length; i++) for (let j = 0; j < i; j++) { const a = S[j], b = S[i], gap = (a.e._h + b.e._h) / 2 + 6;
            if (Math.abs(a.x - b.x) < (a.e._w + b.e._w) / 2 + 4 && b.y - a.y < gap) b.y = a.y + gap; }
          // second pass, bottom-up: keep pushed labels inside the stage by moving their neighbours up instead
          for (let i = S.length - 1; i >= 0; i--) { const b = S[i]; b.y = Math.min(b.y, h - b.e._h / 2 - 4);
            for (let j = i - 1; j >= 0; j--) { const a = S[j], gap = (a.e._h + b.e._h) / 2 + 6;
              if (Math.abs(a.x - b.x) < (a.e._w + b.e._w) / 2 + 4 && b.y - a.y < gap) a.y = b.y - gap; } }
          P.forEach(p => { p.e.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`; p.e.style.opacity = p.f ? 1 : 0; });
          P.forEach((p, i) => { const L = lines[i], hw = p.e._w / 2, hh = p.e._h / 2;
            const ex = Math.min(p.x + hw, Math.max(p.x - hw, p.ax)), ey = Math.min(p.y + hh, Math.max(p.y - hh, p.ay));
            const off = Math.hypot(ex - p.ax, ey - p.ay) > 4; L.g.style.display = p.f && off ? '' : 'none';
            L.ln.setAttribute('x1', p.ax); L.ln.setAttribute('y1', p.ay); L.ln.setAttribute('x2', ex); L.ln.setAttribute('y2', ey);
            L.dot.setAttribute('cx', p.ax); L.dot.setAttribute('cy', p.ay); });
        }
      };
      loop();
      cleanup = () => { cancelAnimationFrame(raf); gl.dispose(); };
      if (opts.ready) opts.ready(ctl);
    });
  }
  function stop() { if (cleanup) cleanup(); cleanup = null; }
  return { LIST, open, stop };
})();
