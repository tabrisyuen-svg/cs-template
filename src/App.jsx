import React, { useState, useMemo } from 'react';

const SUB_REASONS = {
  '延遲出貨': ['物流公司延誤', '惡劣天氣影響', '訂單量大／旺季', '地址資料有誤', '倉庫處理中'],
  '缺貨':     ['產品暫時缺貨', '產品已停產', '補貨中（有預計到貨日）', '補貨中（未有確實日期）'],
  '退換貨':   ['收到貨品損壞', '收到錯誤產品', '產品質量問題', '客戶改變主意'],
  '查詢訂單': ['查詢訂單狀態', '查詢物流追蹤', '查詢發票／收據', '查詢付款狀態'],
};

const BRAND_INFO = {
  'Hape Hong Kong': { email: 'info@hapehk.com',        whatsapp: '+852 5401 6223' },
  'Eurekakids':     { email: 'info@eurekakids.com.hk', whatsapp: '+852 5401 6223' },
};

function generateMessage(p) {
  const b     = BRAND_INFO[p.brand];
  const name  = p.customerName || '顧客';
  const order = p.orderNo ? ('#' + p.orderNo) : '您的訂單';

  const openings = {
    '正式': {
      '道歉為主': '您好，' + name + '，\n\n感謝您聯絡我們。對於您所遇到的情況，我們深感抱歉，並對為您帶來的不便深表歉意。',
      '中性告知': '您好，' + name + '，\n\n感謝您聯絡我們。就您訂單 ' + order + ' 的查詢，現回覆如下。',
      '積極跟進': '您好，' + name + '，\n\n感謝您聯絡我們。我們已即時跟進您的訂單 ' + order + '，請放心。',
    },
    '親切': {
      '道歉為主': '您好，' + name + '！\n\n非常感謝您的聯絡，對於為您帶來的不便，我們衷心致歉！',
      '中性告知': '您好，' + name + '！\n\n感謝您聯絡我們，關於您訂單 ' + order + ' 的查詢，我們已為您了解。',
      '積極跟進': '您好，' + name + '！\n\n感謝您的耐心等待！我們已緊急跟進您的訂單 ' + order + '。',
    },
    '簡潔': {
      '道歉為主': '您好，' + name + '，\n\n就訂單 ' + order + '，非常抱歉為您帶來不便。',
      '中性告知': '您好，' + name + '，\n\n就訂單 ' + order + '，現回覆如下。',
      '積極跟進': '您好，' + name + '，\n\n訂單 ' + order + ' 我們已即時跟進。',
    },
  };

  const bodies = {
    '延遲出貨': {
      '物流公司延誤':  '您的訂單因物流公司延誤，出貨時間有所影響。',
      '惡劣天氣影響':  '受惡劣天氣影響，物流派送有所延遲。',
      '訂單量大／旺季':'由於近期訂單量較大，處理時間較平時稍長。',
      '地址資料有誤':  '我們發現您的送貨地址資料需要確認，以便安排出貨。',
      '倉庫處理中':    '您的訂單目前仍在倉庫處理中，即將安排出貨。',
    },
    '缺貨': {
      '產品暫時缺貨':          '您所訂購的產品目前暫時缺貨。',
      '產品已停產':            '非常抱歉，您所訂購的產品已停產，未能為您供應。',
      '補貨中（有預計到貨日）': '您所訂購的產品正在補貨中，預計近期可以到貨。',
      '補貨中（未有確實日期）': '您所訂購的產品正在補貨中，暫時未有確實到貨日期。',
    },
    '退換貨': {
      '收到貨品損壞': '非常抱歉，您收到的貨品在運送過程中有所損壞。',
      '收到錯誤產品': '非常抱歉，我們發出了錯誤的產品給您。',
      '產品質量問題': '非常抱歉，您收到的產品出現質量問題。',
      '客戶改變主意': '我們已收到您的退換貨申請。',
    },
    '查詢訂單': {
      '查詢訂單狀態':  '就您查詢訂單 ' + order + ' 的最新狀態，我們已為您了解。',
      '查詢物流追蹤':  '就您查詢訂單 ' + order + ' 的物流追蹤，我們已為您跟進。',
      '查詢發票／收據':'就您查詢訂單 ' + order + ' 的發票／收據，我們已為您處理。',
      '查詢付款狀態':  '就您查詢訂單 ' + order + ' 的付款狀態，我們已為您核實。',
    },
  };

  const solutions = {
    '等待': '請您稍作等待，我們將盡快為您跟進及處理。',
    '退款': '我們將為您安排全額退款至原付款方式。',
    '換貨': '我們將為您安排換貨，請您稍候。',
    '補發': '我們將為您重新安排發貨，請您稍候。',
  };

  const closings = {
    '正式': '感謝您的理解與支持。\n\n' + p.brand + ' 客服團隊',
    '親切': '再次感謝您的耐心等待，期待繼續為您服務！\n\n' + p.brand + ' 客服團隊 😊',
    '簡潔': '如有其他問題，請隨時聯絡。\n\n' + p.brand + ' 客服',
  };

  const parts = [];
  const op = openings[p.style] && openings[p.style][p.tone];
  parts.push(op || openings['親切']['道歉為主']);
  const body = bodies[p.mainSituation] && bodies[p.mainSituation][p.subReason];
  if (body) parts.push(body);
  if (p.solution) parts.push(solutions[p.solution] || '');
  if (p.addRefundTime && p.solution === '退款') parts.push('退款將於 5–7 個工作天內退回您的原付款方式，請留意相關通知。');
  if (p.addDiscount && p.discountCode) parts.push('為表歉意，特此奉上優惠碼【' + p.discountCode + '】，供您下次購物使用。');
  if (p.addThanks) parts.push('衷心感謝您對 ' + p.brand + ' 的支持！');
  if (p.addContact) parts.push('如有任何查詢，歡迎透過 WhatsApp ' + b.whatsapp + ' 或電郵 ' + b.email + ' 聯絡我們。');
  parts.push(closings[p.style] || closings['親切']);
  return parts.join('\n\n');
}

export default function App() {
  const [customerName, setCustomerName] = useState('');
  const [orderNo,      setOrderNo]      = useState('');
  const [mainSituation,setMainSituation]= useState('延遲出貨');
  const [subReason,    setSubReason]    = useState(SUB_REASONS['延遲出貨'][0]);
  const [solution,     setSolution]     = useState('等待');
  const [tone,         setTone]         = useState('道歉為主');
  const [style,        setStyle]        = useState('親切');
  const [brand,        setBrand]        = useState('Hape Hong Kong');
  const [addDiscount,  setAddDiscount]  = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [addRefundTime,setAddRefundTime]= useState(false);
  const [addThanks,    setAddThanks]    = useState(false);
  const [addContact,   setAddContact]   = useState(true);
  const [copied,       setCopied]       = useState(false);

  const handleMainChange = function(val) { setMainSituation(val); setSubReason(SUB_REASONS[val][0]); };

  const message = useMemo(function() {
    return generateMessage({ customerName, orderNo, mainSituation, subReason, solution, tone, style, brand, addDiscount, discountCode, addRefundTime, addThanks, addContact });
  }, [customerName, orderNo, mainSituation, subReason, solution, tone, style, brand, addDiscount, discountCode, addRefundTime, addThanks, addContact]);

  const handleCopy = function() {
    navigator.clipboard.writeText(message).then(function() { setCopied(true); setTimeout(function() { setCopied(false); }, 2000); });
  };

  const inp = { width:'100%', padding:'6px 8px', border:'1px solid #ddd', borderRadius:6, boxSizing:'border-box', fontSize:13, marginBottom:2, outline:'none' };
  const lbl = { display:'block', fontSize:11, color:'#888', marginTop:10, marginBottom:4 };
  const hr  = { borderColor:'#e5e7eb', margin:'14px 0' };
  const sec = { fontSize:13, fontWeight:'bold', color:'#374151', margin:'0 0 8px 0' };

  function Chips(props) {
    return (
      React.createElement('div', { style:{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:4 } },
        props.options.map(function(opt) {
          return React.createElement('button', {
            key: opt,
            onClick: function() { props.onChange(opt); },
            style: {
              padding:'4px 12px', borderRadius:20, border:'1px solid', fontSize:12,
              cursor:'pointer', transition:'all 0.15s',
              borderColor: props.value===opt ? '#2563eb' : '#d1d5db',
              background:  props.value===opt ? '#2563eb' : '#fff',
              color:       props.value===opt ? '#fff'    : '#374151',
              fontWeight:  props.value===opt ? 600       : 400,
            }
          }, opt);
        })
      )
    );
  }

  const situationColors = { '延遲出貨':['#b45309','#fef3c7'], '缺貨':['#dc2626','#fee2e2'], '退換貨':['#7c3aed','#ede9fe'], '查詢訂單':['#0369a1','#e0f2fe'] };
  const sc  = situationColors[mainSituation] ? situationColors[mainSituation][0] : '#374151';
  const sbg = situationColors[mainSituation] ? situationColors[mainSituation][1] : '#f3f4f6';

  const tags = [
    { label:brand,         color:'#1d4ed8', bg:'#eff6ff' },
    { label:mainSituation, color:sc,        bg:sbg       },
    { label:tone,          color:'#065f46', bg:'#d1fae5' },
    { label:style,         color:'#7c3aed', bg:'#ede9fe' },
  ];

  const checkboxItems = [
    { key:'discount', label:'附加優惠碼',     val:addDiscount,   set:setAddDiscount   },
    { key:'refund',   label:'附加退款時間說明', val:addRefundTime, set:setAddRefundTime },
    { key:'thanks',   label:'附加感謝購買',     val:addThanks,     set:setAddThanks     },
    { key:'contact',  label:'附加客服聯絡方式', val:addContact,    set:setAddContact    },
  ];

  return (
    React.createElement('div', { style:{ display:'flex', height:'100vh', background:'#f3f4f6', fontFamily:"Arial,'Microsoft JhengHei',sans-serif", overflow:'hidden' } },

      React.createElement('div', { style:{ width:'42%', minWidth:280, background:'#fff', padding:'16px 16px 0', height:'100vh', overflowY:'auto', borderRight:'1px solid #e5e7eb', flexShrink:0 } },
        React.createElement('h2', { style:{ marginTop:0, fontSize:16, color:'#111827', marginBottom:4 } }, '📨 客服回應生成器'),
        React.createElement('div', { style:{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:6, padding:'8px 12px', fontSize:11, color:'#1d4ed8', marginBottom:12, lineHeight:1.7 } }, '填寫左側欄位，右側即時生成回應留言 ✨'),

        React.createElement('h4', { style:sec }, '🏷 品牌'),
        React.createElement(Chips, { options:['Hape Hong Kong','Eurekakids'], value:brand, onChange:setBrand }),
        React.createElement('hr', { style:hr }),

        React.createElement('h4', { style:sec }, '👤 客戶資料'),
        React.createElement('label', { style:lbl }, '客戶稱呼'),
        React.createElement('input', { value:customerName, onChange:function(e){ setCustomerName(e.target.value); }, placeholder:'例：陳先生 / 陳小姐', style:inp }),
        React.createElement('label', { style:lbl }, '訂單號碼'),
        React.createElement('input', { value:orderNo, onChange:function(e){ setOrderNo(e.target.value); }, placeholder:'例：12345', style:Object.assign({}, inp, { fontFamily:'monospace' }) }),
        React.createElement('hr', { style:hr }),

        React.createElement('h4', { style:sec }, '📋 情況'),
        React.createElement('label', { style:lbl }, '主要情況'),
        React.createElement(Chips, { options:['延遲出貨','缺貨','退換貨','查詢訂單'], value:mainSituation, onChange:handleMainChange }),
        React.createElement('label', { style:lbl }, '細分原因'),
        React.createElement('select', { value:subReason, onChange:function(e){ setSubReason(e.target.value); }, style:Object.assign({}, inp, { marginBottom:8 }) },
          SUB_REASONS[mainSituation].map(function(r) { return React.createElement('option', { key:r }, r); })
        ),
        React.createElement('label', { style:lbl }, '解決方案'),
        React.createElement(Chips, { options:['等待','退款','換貨','補發'], value:solution, onChange:setSolution }),
        React.createElement('hr', { style:hr }),

        React.createElement('h4', { style:sec }, '✍️ 語氣風格'),
        React.createElement('label', { style:lbl }, '態度語氣'),
        React.createElement(Chips, { options:['道歉為主','中性告知','積極跟進'], value:tone, onChange:setTone }),
        React.createElement('label', { style:lbl }, '語言風格'),
        React.createElement(Chips, { options:['正式','親切','簡潔'], value:style, onChange:setStyle }),
        React.createElement('hr', { style:hr }),

        React.createElement('h4', { style:sec }, '➕ 附加內容'),
        checkboxItems.map(function(item) {
          return React.createElement('div', { key:item.key, style:{ marginBottom:8 } },
            React.createElement('label', { style:{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#374151', cursor:'pointer' } },
              React.createElement('input', { type:'checkbox', checked:item.val, onChange:function(e){ item.set(e.target.checked); }, style:{ width:15, height:15, cursor:'pointer', accentColor:'#2563eb' } }),
              item.label,
              item.key==='refund' ? React.createElement('span', { style:{ fontSize:10, color:'#9ca3af' } }, '(退款方案適用)') : null
            ),
            item.key==='discount' && item.val
              ? React.createElement('input', { value:discountCode, onChange:function(e){ setDiscountCode(e.target.value); }, placeholder:'輸入優惠碼', style:Object.assign({}, inp, { marginTop:6, marginLeft:24, width:'calc(100% - 24px)', fontFamily:'monospace', letterSpacing:'0.05em' }) })
              : null
          );
        }),
        React.createElement('div', { style:{ height:48 } })
      ),

      React.createElement('div', { style:{ flex:1, height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'#f3f4f6' } },
        React.createElement('div', { style:{ padding:'12px 20px', borderBottom:'1px solid #e5e7eb', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
          React.createElement('span', { style:{ fontSize:14, fontWeight:'bold', color:'#374151' } }, '📄 生成留言預覽'),
          React.createElement('button', {
            onClick:handleCopy,
            style:{ padding:'8px 20px', border:'none', borderRadius:6, cursor:'pointer', fontSize:13, fontWeight:'bold', transition:'all 0.2s', background: copied ? '#16a34a' : '#2563eb', color:'#fff' }
          }, copied ? '✅ 已複製！' : '📋 一鍵複製')
        ),

        React.createElement('div', { style:{ flex:1, padding:24, overflowY:'auto' } },
          React.createElement('div', { style:{ background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 16px rgba(0,0,0,0.08)', maxWidth:560, margin:'0 auto' } },
            React.createElement('div', { style:{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 } },
              tags.map(function(t) {
                return React.createElement('span', { key:t.label, style:{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600, color:t.color, background:t.bg } }, t.label);
              })
            ),
            React.createElement('div', { style:{ fontSize:14, lineHeight:2, color:'#1f2937', whiteSpace:'pre-wrap', borderTop:'1px solid #f3f4f6', paddingTop:16 } }, message)
          )
        ),

        React.createElement('div', { style:{ padding:'8px 24px', textAlign:'center', fontSize:11, color:'#9ca3af', borderTop:'1px solid #e5e7eb', background:'#fff', flexShrink:0 } },
          'created by Tabris Yuen @2026'
        )
      )
    )
  );
}
