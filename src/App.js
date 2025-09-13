import React, { useState, useEffect } from 'react';
import FnForm from './FnForm';
import ResultDisplay from './ResultDisplay';
import RangeSelector from './RangeSelector';
import ProgressBar from './ProgressBar';
import ScatterPlot from './ScatterPlot';
import FrequencyChart from './FrequencyChart';


export default function App() {
  const [form, setForm] = useState({ n: '100', a: '3', b: '1' });
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [graphDuration, setGraphDuration] = useState(0);

  // For graph
  const [nStart, setNStart] = useState(1);
  const [nEnd, setNEnd] = useState(10000);
  const [graphData, setGraphData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, n: 0, cnt: 0 });
  const [barTooltip, setBarTooltip] = useState({ visible: false, x: 0, y: 0, n: 0, cnt: 0 });

  // Frequency state
  const [freq, setFreq] = useState({});

  function isPositiveInteger(value) {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const { a, b, n } = form;
    if (
      isPositiveInteger(a) &&
      isPositiveInteger(b) &&
      isPositiveInteger(n)
    ) {
      calculate(Number(a), Number(b), Number(n));
    } else {
      alert("Please enter positive integers for a, b, and n.");
    }
  }

  function calculate(a, b, n) {
    const start = performance.now();
    let cnt = 0;
    // Only check divisors of n
    for (let d = (b > 1 ? b : a + b); d < n; d += a) {
      if (n % d === 0) {
        cnt++;
        // console.log(d);
      }
    }
    const end = performance.now();
    setCount(cnt);
    setDuration(end - start);
  }

  function plotGraph() {
    const a = Number(form.a);
    const b = Number(form.b);
    const startN = Number(nStart);
    const endN = Number(nEnd);
    if (!isPositiveInteger(a) || !isPositiveInteger(b) || !isPositiveInteger(startN) || !isPositiveInteger(endN) || startN >= endN) {
      alert("Enter valid positive integers for a, b, nStart < nEnd.");
      return;
    }
    let data = [];
    let freqMap = {};
    setProgress(0);
    setGraphDuration(0);
    setGraphData([]);
    setFreq({});
    const total = endN - startN + 1;
    const startTime = performance.now();
    // Use setTimeout to allow UI updates for progress
    function processBatch(batchStart) {
      const batchSize = 100;
      let batchEnd = Math.min(batchStart + batchSize - 1, endN);
      for (let n = batchStart; n <= batchEnd; n++) {
        let cnt = 0;
        for (let d = (b > 1 ? b : a + b); d < n; d += a) {
          if (n % d === 0) {
            cnt++;
          }
        }
        data.push({ n, cnt });
        freqMap[cnt] = (freqMap[cnt] || 0) + 1;
      }
      
      setFreq({...freqMap});
      const done = batchEnd - startN + 1;
      setProgress(Math.round((done / total) * 100));
      if (batchEnd < endN) {
        setTimeout(() => processBatch(batchEnd + 1), 0);
      } else {
        setGraphData([...data]);
        setProgress(100);
        setGraphDuration(performance.now() - startTime);
      }
    }
    processBatch(startN);
  }

  // Responsive plot width: always fit window size and update on resize
  const padding = 60;
  const [plotWidth, setPlotWidth] = useState(() => Math.max(400, window.innerWidth - padding * 2 - 30));
  const height = 400;

  useEffect(() => {
    function handleResize() {
      setPlotWidth(Math.max(400, window.innerWidth - padding * 2 - 30));
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tickCount = 5;
  const maxCnt = Math.max(...graphData.map(d => d.cnt), 1);

  // Axis ticks
  const xTicks = Array.from({length: tickCount+1}, (_, i) => Math.round(Number(nStart) + i*(Number(nEnd)-Number(nStart))/tickCount));
  const yTicks = Array.from({length: tickCount+1}, (_, i) => Math.round(i*maxCnt/tickCount));

  // Frequency chart dimensions based on number of bars
  const freqEntries = Object.entries(freq)
    .map(([cnt, f]) => ({cnt: Number(cnt), freq: f}))
    .sort((a, b) => a.cnt - b.cnt);
  const minChartWidth = 400;
  const maxChartWidth = Math.min(window.innerWidth - 120, 900);
  const chartWidth = Math.max(minChartWidth, Math.min(maxChartWidth, freqEntries.length * 24 + 120));
  const chartHeight = 240;
  const chartPadding = 60;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      padding: '40px'
    }}>
      <div style={{
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px 40px'
      }}>
        <h1 style={{textAlign: 'center', color: '#2563eb', marginBottom: 32}}>Fn(ax+b)</h1>
        <FnForm form={form} onChange={handleChange} onSubmit={submit} />
        <ResultDisplay count={count} duration={duration} />
        <hr style={{margin: '32px 0', borderColor: '#e5e7eb'}} />
        <div>
          <h2 style={{color: '#2563eb', marginBottom: 18}}>Plot number of solutions for n range</h2>
          <RangeSelector nStart={nStart} nEnd={nEnd} setNStart={setNStart} setNEnd={setNEnd} onPlot={plotGraph} />
          <ProgressBar progress={progress} graphDuration={graphDuration} />
          <div style={{position: 'relative', background: '#f1f5f9', borderRadius: 12, padding: 16, marginTop: 16, boxShadow: '0 2px 8px rgba(37,99,235,0.04)'}}>
            {graphData.length > 0 && (
              <ScatterPlot
                graphData={graphData}
                nStart={nStart}
                nEnd={nEnd}
                width={plotWidth}
                height={height}
                padding={padding}
                maxCnt={maxCnt}
                xTicks={xTicks}
                yTicks={yTicks}
                tooltip={tooltip}
                setTooltip={setTooltip}
              />
            )}
            {/* Tooltip for scatter plot */}
            {tooltip.visible && (
              <div
                style={{
                  position: 'absolute',
                  left: tooltip.x + 20,
                  top: tooltip.y - 10,
                  background: '#fff',
                  border: '1px solid #2563eb',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: '15px',
                  color: '#2563eb',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
              >
                <div>n: {tooltip.n}</div>
                <div># solutions: {tooltip.cnt}</div>
              </div>
            )}
            {/* Frequency chart */}
            {graphData.length > 0 && (
              <div style={{marginTop: 32}}>
                <h3 style={{color: '#2563eb', fontWeight: 600, fontSize: 18, marginBottom: 8}}>Frequency of solution counts</h3>
                <div style={{background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(37,99,235,0.04)', position: 'relative'}}>
                  <FrequencyChart
                    freqEntries={freqEntries}
                    chartWidth={chartWidth}
                    chartHeight={chartHeight}
                    chartPadding={chartPadding}
                    maxFreq={Math.max(...freqEntries.map(e => e.freq), 1)}
                    barTooltip={barTooltip}
                    setBarTooltip={setBarTooltip}
                  />
                  {/* Bar chart tooltip */}
                  {barTooltip.visible && (
                    <div
                      style={{
                        position: 'absolute',
                        left: barTooltip.x + 20,
                        top: barTooltip.y,
                        background: '#fff',
                        border: '1px solid #2563eb',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: '15px',
                        color: '#2563eb',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    >
                      <div># solutions: {barTooltip.n}</div>
                      <div>Frequency: {barTooltip.cnt}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
