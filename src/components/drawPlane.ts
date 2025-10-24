export type DrawPlaneOptions = {
  width?: number;    // default 680
  height?: number;   // default 680
  padding?: number;  // default 100
  showGrid?: boolean; // default true
};

export type DrawPoint = {
  x: number;
  y: number;
  label?: string;
  fill?: string;
  size?: number; // default 6
};

/**
 * drawPlane(container, points, opts)
 *  - container: selector or DOM element to append SVG into
 *  - points: [{ x: number, y: number, label?: string, fill?: string }]
 *  - opts: { width, height, showGrid }
 *
 * **Example:**
 * ```
 * const samplePoints = [
 *   { x: 4.5, y: 3.2, label: 'P1' },
 *   { x: -5.5, y: 5.8, label: 'P2', color: '#e67e22' },
 *   { x: 7.2, y: -7.0, label: '超出邊界' } // 會在邊界標示並以虛線連回
 * ];
 *
 * drawPlane('#plane', samplePoints, { width: 680, height: 680, showGrid: false });
 * ```
 */
export function drawPlane(container: HTMLElement, points: DrawPoint[] = [], opts: DrawPlaneOptions = {}): void {
  const containerEl = (typeof container === 'string') ? document.querySelector(container) : container;
  if (!containerEl) throw new Error('Container not found');

  // Config
  const width = opts.width || 680;
  const height = opts.height || 680;
  const padding = opts.padding || 100;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const minCoord = -6, maxCoord = 6;
  const xRange = maxCoord - minCoord;
  const yRange = maxCoord - minCoord;

  // bounds
  const innerBound = { left: padding, top: padding, right: padding + innerW, bottom: padding + innerH };
  const outerBound = { left: 0, top: 0, right: width, bottom: height };

  // Helper: map (x,y) to SVG coordinates
  function mapX(x: number) {
    const t = (x - minCoord) / xRange; // 0..1
    return innerBound.left + t * innerW;
  }
  function mapY(y: number) {
    // SVG y goes down, so invert
    const t = (y - minCoord) / yRange;
    return innerBound.top + (1 - t) * innerH;
  }

  // Remove old svg if exists
  containerEl.innerHTML = '';

  // Create svg
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Background rect
  const bg = document.createElementNS(svgNS, 'rect');
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
  bg.setAttribute('width', `${width}`); bg.setAttribute('height', `${height}`);
  bg.setAttribute('fill', 'transparent');
  svg.appendChild(bg);

  // Optionally draw grid lines at integer coordinates -6..6
  if (opts.showGrid ?? true) {
    for (let xi = minCoord; xi <= maxCoord; xi++) {
      const x = mapX(xi);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', `${x}`); line.setAttribute('x2', `${x}`);
      line.setAttribute('y1', `${innerBound.bottom}`); line.setAttribute('y2', `${innerBound.top}`);
      line.setAttribute('stroke', '#eee');
      line.setAttribute('stroke-width', `${xi === 0 ? 2 : 1}`);
      svg.appendChild(line);
      // x ticks (except 0 we will label below)
      if (xi !== 0) {
        const tx = document.createElementNS(svgNS, 'text');
        tx.setAttribute('x', `${x}`);
        tx.setAttribute('y', `${innerBound.bottom + 16}`);
        tx.setAttribute('text-anchor', 'middle');
        tx.setAttribute('font-size', '11');
        tx.textContent = `${xi}`;
        svg.appendChild(tx);
      }
    }
    for (let yi = minCoord; yi <= maxCoord; yi++) {
      const y = mapY(yi);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('y1', `${y}`); line.setAttribute('y2', `${y}`);
      line.setAttribute('x1', `${innerBound.left}`); line.setAttribute('x2', `${innerBound.right}`);
      line.setAttribute('stroke', '#eee');
      line.setAttribute('stroke-width', `${yi === 0 ? 2 : 1}`);
      svg.appendChild(line);
      if (yi !== 0) {
        const ty = document.createElementNS(svgNS, 'text');
        ty.setAttribute('x', `${innerBound.left - 10}`);
        ty.setAttribute('y', `${y + 4}`);
        ty.setAttribute('text-anchor', 'end');
        ty.setAttribute('font-size', '11');
        ty.textContent = `${yi}`;
        svg.appendChild(ty);
      }
    }
  }

  // Draw axes (thicker)
  const x0 = mapY(0); // horizontal line y coordinate
  const y0 = mapX(0); // vertical line x coordinate

  const axisStyle = { stroke: '#555', 'stroke-width': 2, 'stroke-linecap': 'butt' };
  // x-axis
  const xAxis = document.createElementNS(svgNS, 'line');
  xAxis.setAttribute('x1', `${innerBound.left}`);
  xAxis.setAttribute('x2', `${innerBound.right}`);
  xAxis.setAttribute('y1', `${mapY(0)}`);
  xAxis.setAttribute('y2', `${mapY(0)}`);
  Object.entries(axisStyle).forEach(([k,v]) => xAxis.setAttribute(k, `${v}`));
  svg.appendChild(xAxis);

  // y-axis
  const yAxis = document.createElementNS(svgNS, 'line');
  yAxis.setAttribute('y1', `${innerBound.top}`);
  yAxis.setAttribute('y2', `${innerBound.bottom}`);
  yAxis.setAttribute('x1', `${mapX(0)}`);
  yAxis.setAttribute('x2', `${mapX(0)}`);
  Object.entries(axisStyle).forEach(([k,v]) => yAxis.setAttribute(k, `${v}`));
  svg.appendChild(yAxis);

  // Arrow markers defs
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('markerWidth', `10`);
  marker.setAttribute('markerHeight', `10`);
  marker.setAttribute('refX', `5`);
  marker.setAttribute('refY', `5`);
  marker.setAttribute('orient', 'auto');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M0,0 L10,5 L0,10 L2,5 z');
  path.setAttribute('fill', '#333');
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Add arrowheads to four axis ends by drawing small lines that use marker-end
  function drawArrowLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number) {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', `${x1}`);
    line.setAttribute('x2', `${x2}`);
    line.setAttribute('y1', `${y1}`);
    line.setAttribute('y2', `${y2}`);
    line.setAttribute('stroke', axisStyle.stroke);
    line.setAttribute('stroke-width', `${axisStyle['stroke-width']}`);
    line.setAttribute('marker-end', 'url(#arrow)');
    svg.appendChild(line);
  }
  drawArrowLine(svg, mapX(6), mapY(0), mapX(6) + 10, mapY(0)); // +x arrow
  drawArrowLine(svg, mapX(-6), mapY(0), mapX(-6) - 10, mapY(0)); // -x arrow
  drawArrowLine(svg, mapX(0), mapY(-6), mapX(0), mapY(-6) + 10); // +y arrow
  drawArrowLine(svg, mapX(0), mapY(6), mapX(0), mapY(6) - 10); // -y arrow

  type DrawTextLabelOptions = {
    align?: 'l' | 'r' | 'c' | 't' | 'b' | 'tl' | 'tr' | 'bl' | 'br'; // default 'c' (horizontal: left, right, center; vertical: top, bottom, middle)
    fontSize?: number; // default 13
    margin?: number; // default fontSize/2
    fontWeight?: number | string; // default 600
    fill?: string; // default '#000'
    stroke?: string; // default ''
    strokeWidth?: number; // default 1 if stroke is set, else 0
  };

  // Axis end labels (按照你的表格)
  function drawTextLabel(svg: SVGElement, x: number, y: number, text: string, { align = 'c', fontSize = 13, margin = fontSize / 2, fontWeight = 600, fill = '#000', stroke = '', strokeWidth = stroke ? 1 : 0 }: DrawTextLabelOptions = {}) {
    const t = document.createElementNS(svgNS, 'text');
    const hAnchor = align.includes('l') ? 'end' : (align.includes('r') ? 'start' : 'middle');
    const vAnchor = align.includes('t') ? 'text-after-edge' : (align.includes('b') ? 'text-before-edge' : 'middle');
    t.setAttribute('x', `${x + (align.includes('l') ? -margin : (align.includes('r') ? margin : 0))}`);
    t.setAttribute('y', `${y + (align.includes('t') ? -margin : (align.includes('b') ? margin : 0))}`);
    t.setAttribute('text-anchor', hAnchor);
    t.setAttribute('dominant-baseline', vAnchor);
    t.setAttribute('font-size', `${fontSize}`);
    t.setAttribute('font-weight', `${fontWeight}`);
    t.setAttribute('fill', fill);
    t.setAttribute('stroke', stroke);
    t.setAttribute('stroke-width', `${strokeWidth}`);
    t.textContent = text;
    svg.appendChild(t);
  }

  // x-axis 正方向 (右)
  drawTextLabel(svg, mapX(6), mapY(0), '外向 +6' , { align: 'r', fontSize: 20, margin: 24, fill: '#555' });

  // x-axis 負方向 (左)
  drawTextLabel(svg, mapX(-6), mapY(0), '內向 -6' , { align: 'l', fontSize: 20, margin: 24, fill: '#555' });

  // y-axis 正方向 (上)
  drawTextLabel(svg, mapX(0), mapY(6), '神經質 +6', { align: 't', fontSize: 20, margin: 24, fill: '#555' });

  // y-axis 負方向 (下)
  drawTextLabel(svg, mapX(0), mapY(-6), '穩定 -6' , { align: 'b', fontSize: 20, margin: 24, fill: '#555' });

  // 四象限角落標籤
  // // 第一象限 (x>0,y>0) 右上角
  // drawTextLabel(svg, mapX(3), mapY(3), '暴躁', { fill: '#ddd', fontSize: 48, fontWeight: 700 });

  // // 第二象限 (x<0,y>0) 左上
  // drawTextLabel(svg, mapX(-3), mapY(3), '憂鬱', { fill: '#ddd', fontSize: 48, fontWeight: 700 });

  // // 第三象限 (x<0,y<0) 左下
  // drawTextLabel(svg, mapX(-3), mapY(-3), '冷靜', { fill: '#ddd', fontSize: 48, fontWeight: 700 });

  // // 第四象限 (x>0,y<0) 右下
  // drawTextLabel(svg, mapX(3), mapY(-3), '熱情', { fill: '#ddd', fontSize: 48, fontWeight: 700 });

  /**
   * @param {{width: number, height: number}} size - font size
   * @param {{x: number, y: number}} anchor - anchor point
   * @param {{left: number, top: number, right: number, bottom: number}} bound - bounding box {left,top,right,bottom}
   * @returns {'tl'|'tr'|'bl'|'br'} - best align position
   */
  function getAlign(size: { width: number, height: number }, anchor: { x: number, y: number }, bound: { left: number, top: number, right: number, bottom: number }) {
    const space = {
      left: anchor.x - bound.left,
      right: bound.right - anchor.x,
      top: anchor.y - bound.top,
      bottom: bound.bottom - anchor.y,
    };
    const canTop = space.top >= size.height;
    const canBottom = space.bottom >= size.height;
    const canLeft = space.left >= size.width;
    const canRight = space.right >= size.width;
    if (canTop && canRight) return 'tr';
    if (canBottom && canRight) return 'br';
    if (canBottom && canLeft) return 'bl';
    if (canTop && canLeft) return 'tl';
    return 'br';
  }

  // Draw points
  points.forEach((p, idx) => {
    const px = p.x;
    const py = p.y;
    const fill = p.fill || '#333';
    const size = p.size || 6;
    const clampedX = Math.max(minCoord, Math.min(maxCoord, px));
    const clampedY = Math.max(minCoord, Math.min(maxCoord, py));
    const outOfBounds = (px !== clampedX) || (py !== clampedY);

    const sx = mapX(clampedX);
    const sy = mapY(clampedY);
    const trueX = mapX(px); // may be outside viewBox
    const trueY = mapY(py);

    // If out of bounds, draw a small cross at edge and a dashed line pointing to imaginary real position
    if (outOfBounds) {
      // dashed line from edge toward inward direction of true position
      const dash = document.createElementNS(svgNS, 'line');
      dash.setAttribute('x1', `${sx}`);
      dash.setAttribute('y1', `${sy}`);
      dash.setAttribute('x2', `${trueX}`);
      dash.setAttribute('y2', `${trueY}`);
      dash.setAttribute('stroke', fill);
      dash.setAttribute('stroke-width', `1`);
      dash.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(dash);
    }

    // Draw marker (circle)
    const c = document.createElementNS(svgNS, 'circle');
    if (outOfBounds) {
      c.setAttribute('stroke-dasharray', '2 2');
      c.setAttribute('stroke', fill);
      c.setAttribute('fill', 'none');
      c.setAttribute('cx', `${trueX}`);
      c.setAttribute('cy', `${trueY}`);
      c.setAttribute('r', `${size * 0.7}`);
    } else {
      c.setAttribute('cx', `${sx}`);
      c.setAttribute('cy', `${sy}`);
      c.setAttribute('r', `${size}`);
      c.setAttribute('fill', fill);
      c.setAttribute('stroke', '#fff');
      c.setAttribute('stroke-width', `1.5`);
    }
    svg.appendChild(c);

    // label next to point (use given label or coordinates)
    const labelText = p.label ? `${p.label} (${px},${py})` : `(${px},${py})`;
    const align = getAlign(
      { width: Math.abs(mapX(1) - mapX(0)) - 1, height: Math.abs(mapY(1) - mapY(0)) - 1 },
      { x: sx, y: sy },
      { left: mapX(-6), top: mapY(6), right: mapX(6), bottom: mapY(-6) });
    drawTextLabel(svg, sx, sy, labelText, { align, margin: size + 2, fontSize: 20, fontWeight: 700, stroke: '#fff', strokeWidth: 0.1 });
  });

  // Append svg to container
  containerEl.appendChild(svg);
}
