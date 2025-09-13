import React, { useState, useEffect } from 'react';
import FnForm from './FnForm';
import ResultDisplay from './ResultDisplay';
import RangeSelector from './RangeSelector';
import ProgressBar from './ProgressBar';
import CanvasJSReact from '@canvasjs/react-charts';


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
  // Algorithm selection
  const [algorithm, setAlgorithm] = useState('sieve');

  // Frequency state
  const [freq, setFreq] = useState({});

  function isPositiveIntegerOrZero(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
  }

  function validateInput(...values) {
    return values.every(isPositiveIntegerOrZero);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const { a, b, n } = form;
    if (validateInput(a, b, n)) {
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

  // Brute force: O(n^2)
  function plotGraph() {
    const a = Number(form.a);
    const b = Number(form.b);
    const startN = Number(nStart);
    const endN = Number(nEnd);
    if (!validateInput(a, b, startN, endN) || startN >= endN) {
      alert("Enter valid positive integers for a, b, nStart < nEnd.");
      return;
    }
    let data = [];
    let freqMap = {};
    setProgress(0);
    setGraphDuration(0);
    setGraphData([]);
    setFreq({});
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

      setFreq({ ...freqMap });
      const done = batchEnd - startN + 1;
      const total = endN - startN + 1;
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

  // Use sieve algorithm
  async function plotGraphV2() {
    const a = Number(form.a);
    const b = Number(form.b);
    const startN = Number(nStart);
    const endN = Number(nEnd);
    if (!validateInput(a, b, startN, endN) || startN >= endN) {
      alert("Enter valid positive integers for a, b, nStart < nEnd.");
      return;
    }
    let data = Array(endN - startN + 1).fill(0);
    let freqMap = {};
    setProgress(0);
    setGraphDuration(0);
    setGraphData([]);
    setFreq({});
    const startTime = performance.now();
    // Sieve-like algorithm
    for (let d = (b > 1 ? b : a + b); d+d < endN; d += a) {
      for (let i = Math.max((Math.ceil(startN / d) + 1) * d, d * 2); i <= endN; i += d) {
        data[i - startN]++;
      }
      // function timeout(delay) {
      //   return new Promise(res => setTimeout(res, delay));
      // }
      // await timeout(1);

      // let graphData = [];
      // for (let n = startN; n <= endN; n++) {
      //   let cnt = data[n - startN];
      //   graphData.push({ n, cnt });
      //   freqMap[cnt] = (freqMap[cnt] || 0) + 1;
      // }
      // setGraphData(graphData);
      setProgress(Math.round((d / endN) * 100));
    }
    // Build graphData and freqMap
    let graphData = [];
    for (let n = startN; n <= endN; n++) {
      let cnt = data[n - startN];
      graphData.push({ n, cnt });
      freqMap[cnt] = (freqMap[cnt] || 0) + 1;
    }
    setGraphData(graphData);
    setFreq(freqMap);
    setProgress(100);
    setGraphDuration(performance.now() - startTime);
  }

  // Responsive plot width: always fit window size and update on resize
  const padding = 60;
  const [plotWidth, setPlotWidth] = useState(window.innerWidth - padding * 2 - 30);
  const height = 400;

  useEffect(() => {
    function handleResize() {
      setPlotWidth(window.innerWidth - padding * 2 - 30);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Frequency chart dimensions based on number of bars
  const freqEntries = Object.entries(freq)
    .map(([cnt, f]) => ({ cnt: Number(cnt), freq: f }))
    .sort((a, b) => a.cnt - b.cnt);
  const maxChartWidth = window.innerWidth - 120;
  const chartWidth = maxChartWidth;
  const chartHeight = 240;

  // Prepare data for CanvasJS charts
  const scatterDataPoints = graphData.map(d => ({
    x: d.n,
    y: d.cnt
  }));

  const freqDataPoints = freqEntries.map(e => ({
    label: String(e.cnt),
    y: e.freq
  }));

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
        <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: 32 }}>Fn(ax+b)</h1>
        <FnForm form={form} onChange={handleChange} onSubmit={submit} />
        <ResultDisplay count={count} duration={duration} />
        <hr style={{ margin: '32px 0', borderColor: '#e5e7eb' }} />
        <div>
          <h2 style={{ color: '#2563eb', marginBottom: 18 }}>Plot number of solutions for n range</h2>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="algorithm-select" style={{ marginRight: 10, fontWeight: 500 }}>Algorithm:</label>
            <select id="algorithm-select" value={algorithm} onChange={e => setAlgorithm(e.target.value)} style={{ padding: '6px 12px', fontSize: 15 }}>
              <option value="brute">Brute Force</option>
              <option value="sieve">Sieve (Fast)</option>
            </select>
          </div>
          <RangeSelector nStart={nStart} nEnd={nEnd} setNStart={setNStart} setNEnd={setNEnd} onPlot={algorithm === 'sieve' ? plotGraphV2 : plotGraph} />
          <ProgressBar progress={progress} graphDuration={graphDuration} />
          <div style={{ position: 'relative', background: '#f1f5f9', borderRadius: 12, padding: 16, marginTop: 16, boxShadow: '0 2px 8px rgba(37,99,235,0.04)' }}>
            {/* Scatter plot using CanvasJS */}
            {graphData.length > 0 && (
              <CanvasJSReact.CanvasJSChart
                options={{
                  animationEnabled: true,
                  theme: "light2",
                  title: { text: "Number of Solutions per n" },
                  axisX: { title: "n" },
                  axisY: { title: "# solutions" },
                  data: [{
                    type: "scatter",
                    toolTipContent: "<b>n:</b> {x} <br/><b># solutions:</b> {y}",
                    dataPoints: scatterDataPoints
                  }]
                }}
                containerProps={{ width: `${plotWidth}px`, height: `${height}px` }}
              />
            )}
            {/* Frequency chart using CanvasJS */}
            {graphData.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Frequency of solution counts</h3>
                <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(37,99,235,0.04)', position: 'relative' }}>
                  <CanvasJSReact.CanvasJSChart
                    options={{
                      animationEnabled: true,
                      theme: "light2",
                      title: { text: "Frequency of Solution Counts" },
                      axisX: { title: "# solutions" },
                      axisY: { title: "Frequency" },
                      data: [{
                        type: "column",
                        toolTipContent: "<b># solutions:</b> {label} <br/><b>Frequency:</b> {y}",
                        dataPoints: freqDataPoints
                      }]
                    }}
                    containerProps={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}