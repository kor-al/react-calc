(this["webpackJsonpreact-calc"]=this["webpackJsonpreact-calc"]||[]).push([[0],{16:function(t,e,s){},17:function(t,e,s){},28:function(t,e,s){"use strict";s.r(e);var i=s(1),n=s.n(i),r=s(9),a=s.n(r),c=(s(16),s(17),s(11)),u=s(2),l=s(7),h=s(6),o=s(3),p=s(4),v=s(0),b=function(){function t(){Object(o.a)(this,t),this.stack=[]}return Object(p.a)(t,[{key:"push",value:function(t){this.stack.push(t)}},{key:"peek",value:function(){if(0!==this.stack.length)return this.stack[this.stack.length-1]}},{key:"pop",value:function(){if(0!==this.stack.length)return this.stack.pop()}},{key:"isEmpty",value:function(){return 0===this.stack.length}},{key:"print",value:function(){if("object"==typeof this.peek()){var t="";return this.stack.forEach((function(e){for(var s in e)t+=s+": "+e[s]+"; "})),t}return this.stack.join(", ")}}]),t}(),d=function(){function t(e){var s=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(Object(o.a)(this,t),!["+","-","*","/","(",")"].includes(e))throw new Error("".concat(e," is not an operation!"));this.operation=e,this.unary=s}return Object(p.a)(t,[{key:"priority",value:function(){return"-"===this.operation&&this.unary?3:"+"===this.operation||"-"===this.operation?1:"*"===this.operation||"/"===this.operation?2:"("===this.operation||")"===this.operation?0:void 0}},{key:"apply",value:function(t,e){switch(this.operation){case"+":return t+e;case"-":return this.unary?-1*e:t-e;case"*":return t*e;case"/":return t/e;default:throw new Error("".concat(this.operation," is not an operation!"))}}}]),t}(),j=function(){function t(){Object(o.a)(this,t),this.reset(),this.currentNumber=void 0}return Object(p.a)(t,[{key:"reset",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;t?(this.inputSeq=[t],this.numberIsLastResult=!0):(this.inputSeq=[],this.numberIsLastResult=!1),this.inNumber=!1,this.hasDecimal=!1,this.bracketOpen=!1}},{key:"parse",value:function(t){var e=this.inputSeq[this.inputSeq.length-1];if("equals"===t.type){if(!this.inputSeq.length||this.numberIsLastResult)return;for(;this.inputSeq.length&&"operation"===e.type;)this.inputSeq.pop(),e=this.inputSeq[this.inputSeq.length-1];this.bracketOpen&&this.inputSeq.push({type:"bracket",val:")"}),this.inputSeq.push(t)}return"("===t.val&&(0===this.inputSeq.length||this.inputSeq.length&&"operation"===e.type)&&(this.bracketOpen=!0,this.inputSeq.push(t)),")"===t.val&&this.bracketOpen&&"("!==e.val&&"operation"!==e.type&&(this.bracketOpen=!1,this.inputSeq.push(t)),"operation"===t.type&&(this.inNumber=!1,this.hasDecimal=!1,this.numberIsLastResult&&(this.numberIsLastResult=!1),"-"===t.val&&(0===this.inputSeq.length||this.inputSeq.length&&"number"!==e.type)?t.unary=!0:t.unary=!1,0===this.inputSeq.length&&"-"!==t.val||(this.inputSeq.length&&"operation"===e.type&&(!1===t.unary||!0===t.unary&&!0===e.unary)?("operation"===this.inputSeq[this.inputSeq.length-2].type&&(this.inputSeq.pop(),"-"===t.val&&t.unary&&(t.unary=!1)),this.inputSeq[this.inputSeq.length-1]=t):this.inputSeq.push(t))),"number"!==t.type&&"decimal"!==t.type||(this.numberIsLastResult&&(this.inputSeq=[],this.numberIsLastResult=!1),this.inNumber?("number"===t.type&&(1===this.currentNumber.val.length&&"0"===this.currentNumber.val[0]&&"0"===t.val?console.log("already has leading zero"):this.currentNumber.val+=t.val),"decimal"===t.type&&(this.inNumber=!0,this.hasDecimal||(this.currentNumber.val+=t.val,this.hasDecimal=!0)),this.inputSeq[this.inputSeq.length-1]=this.currentNumber):(this.inNumber=!0,"decimal"===t.type&&(t.val="0"+t.val,t.type="number"),this.currentNumber=t,this.inputSeq.push(this.currentNumber))),this.inputSeq[this.inputSeq.length-1]}},{key:"getExpression",value:function(){return this.inputSeq.map((function(t){return t.val})).join("")}}]),t}(),y=function(t){Object(l.a)(s,t);var e=Object(h.a)(s);function s(t){var i;return Object(o.a)(this,s),(i=e.call(this,t)).handleClick=i.handleClick.bind(Object(u.a)(i)),i}return Object(p.a)(s,[{key:"handleClick",value:function(){"clear"===this.props.type?this.props.register():this.props.register({val:this.props.label,type:this.props.type})}},{key:"render",value:function(){return Object(v.jsxs)("button",{id:this.props.id,className:this.props.type,onClick:this.handleClick,children:[" ",this.props.label]})}}]),s}(n.a.Component),m=function(t){Object(l.a)(s,t);var e=Object(h.a)(s);function s(t){var i;return Object(o.a)(this,s),(i=e.call(this,t)).handleResultClick=i.handleResultClick.bind(Object(u.a)(i)),i}return Object(p.a)(s,[{key:"handleResultClick",value:function(t,e){this.props.setValueFunc(t,e)}},{key:"render",value:function(){var t=this,e=this.props.items.reverse();return Object(v.jsx)("ol",{className:"history",children:e.map((function(e,s){return Object(v.jsxs)("li",{className:"historyItem",onClick:function(){return t.handleResultClick(e.result,e.expression)},children:[e.expression,Object(v.jsx)("span",{className:"expressionResult",children:e.result.toString()})]},"item".concat(s))}))})}}]),s}(n.a.Component);function f(t){return Object(v.jsx)("ol",{className:"blobs",children:t.items.reverse().slice(0,+Math.min(t.items.length,+t.maxBlobs)).map((function(t,e){return Object(v.jsx)("li",{className:"blobsItem",children:Object(v.jsx)("svg",{id:"blobSvg-".concat(e),xmlns:"http://www.w3.org/2000/svg",height:"400",width:"400",viewBox:"0 0 200 200",children:Object(v.jsx)("path",{d:"M39.6,-47.2C51.9,-36.8,62.9,-24.9,65.1,-11.6C67.3,1.8,60.9,16.6,54.2,34.3C47.6,52,40.8,72.7,26.6,81.5C12.4,90.4,-9.2,87.5,-25.3,78C-41.4,68.5,-52.1,52.3,-57.5,36.4C-63,20.4,-63.2,4.6,-61.8,-12.1C-60.3,-28.9,-57.1,-46.6,-46.5,-57.2C-35.9,-67.8,-18,-71.4,-2.2,-68.8C13.6,-66.2,27.3,-57.5,39.6,-47.2Z",transform:"translate(100,100)"})})},"blob-item".concat(e))}))})}var O=function(t){Object(l.a)(s,t);var e=Object(h.a)(s);function s(t){var i;return Object(o.a)(this,s),(i=e.call(this,t)).state={history:[],currentItem:0,currentExpr:""},i.ops=new b,i.values=new b,i.parser=new j,i.result=0,i.execute=i.execute.bind(Object(u.a)(i)),i.reset=i.reset.bind(Object(u.a)(i)),i.registerInput=i.registerInput.bind(Object(u.a)(i)),i.calcOp=i.calcOp.bind(Object(u.a)(i)),i.saveToHistory=i.saveToHistory.bind(Object(u.a)(i)),i.setFirstInputValue=i.setFirstInputValue.bind(Object(u.a)(i)),i}return Object(p.a)(s,[{key:"componentDidMount",value:function(){var t=document.querySelector(".nav__calc"),e=document.querySelector(".nav__history"),s=document.querySelector(".pads"),i=document.querySelector(".history");t.classList.add("active--link"),t.addEventListener("click",(function(n){t.classList.contains("active--link")||t.classList.add("active--link"),e.classList.contains("active--link")&&e.classList.remove("active--link"),s.classList.contains("active--left")&&s.classList.remove("active--left"),i.classList.contains("active--left")&&i.classList.remove("active--left")})),e.addEventListener("click",(function(n){e.classList.contains("active--link")||e.classList.add("active--link"),t.classList.contains("active--link")&&t.classList.remove("active--link"),s.classList.contains("active--left")||s.classList.add("active--left"),i.classList.contains("active--left")||i.classList.add("active--left")}))}},{key:"saveToHistory",value:function(t,e){var s={expression:t,result:e};this.setState({history:[].concat(Object(c.a)(this.state.history),[s])})}},{key:"reset",value:function(){this.setState({currentItem:0,currentExpr:""}),this.parser.reset(),this.ops=new b,this.values=new b}},{key:"setFirstInputValue",value:function(t,e){this.parser.reset({val:t,type:"number"}),this.setState({currentItem:t}),e&&this.setState({currentExpr:e})}},{key:"registerInput",value:function(t){var e=this.parser.parse(t);if(e&&this.setState({currentExpr:this.parser.getExpression()}),"equals"===t.type){var s=this.execute();void 0!==s&&(this.saveToHistory(this.parser.getExpression(),s),this.setState({currentItem:s}),this.setFirstInputValue(s))}else e&&this.setState({currentItem:e.val})}},{key:"calcOp",value:function(){var t=this.values.pop(),e=this.ops.pop(),s=e.unary?void 0:this.values.pop();this.values.push(e.apply(s,t))}},{key:"execute",value:function(){if(console.log(this.parser.getExpression()),!this.parser.inputSeq.length||"="===this.parser.inputSeq[this.parser.inputSeq.length-1].val){for(var t=this.parser.inputSeq.slice(0,this.parser.inputSeq.length-1),e=0;e<t.length;e++)if("("===t[e].val)this.ops.push(new d(t[e].val));else if("number"===t[e].type)this.values.push(+t[e].val);else if(")"===t[e].val){for(;!this.ops.isEmpty()&&"("!==this.ops.peek().operation;)this.calcOp();this.ops.isEmpty()||this.ops.pop()}else{var s=void 0;for(s=t[e].unary?new d(t[e].val,!0):new d(t[e].val);!this.ops.isEmpty()&&this.ops.peek().priority()>=s.priority();)this.calcOp();this.ops.push(s)}for(;!this.ops.isEmpty();)this.calcOp();var i=this.values.peek();return i=Math.round(1e5*i)/1e5}}},{key:"render",value:function(){var t=this,e={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9},s={add:"+",subtract:"-",multiply:"*",divide:"/"};return Object(v.jsxs)("div",{id:"container",children:[Object(v.jsxs)("div",{id:"calc",children:[Object(v.jsxs)("div",{id:"output",children:[Object(v.jsx)("div",{id:"expression",children:this.state.currentExpr}),Object(v.jsx)("div",{id:"display",children:this.state.currentItem})]}),Object(v.jsxs)("nav",{className:"nav",children:[Object(v.jsx)("span",{className:"nav__calc",children:"Calculator"}),Object(v.jsx)("span",{className:"nav__history",children:"History"})]}),Object(v.jsxs)("div",{className:"interface",children:[Object(v.jsxs)("div",{className:"pads",children:[Object(v.jsxs)("div",{className:"pads--numbers",children:[Object(v.jsx)(y,{id:"decimal",label:".",type:"decimal",register:this.registerInput},"decimal"),Object.keys(e).map((function(s,i){return Object(v.jsx)(y,{id:s.toString(),label:e[s].toString(),type:"number",register:t.registerInput},s.toString())}))]}),Object(v.jsxs)("div",{className:"pads--operations",children:[Object.keys(s).map((function(e,i){return Object(v.jsx)(y,{id:e.toString(),label:s[e].toString(),type:"operation",register:t.registerInput},e.toString())})),Object(v.jsx)(y,{label:"(",type:"bracket",register:this.registerInput},"lbracket"),Object(v.jsx)(y,{label:")",type:"bracket",register:this.registerInput},"rbracket"),Object(v.jsx)(y,{label:"=",type:"equals",id:"equals",register:this.registerInput},"equals"),Object(v.jsx)(y,{label:"C",id:"clear",type:"clear",register:this.reset},"C")]})]}),Object(v.jsx)(m,{items:this.state.history,setValueFunc:this.setFirstInputValue})]})]}),Object(v.jsx)(f,{items:this.state.history,maxBlobs:7})]})}}]),s}(n.a.Component),k=s(10),g=s.n(k);var S=function(){return Object(v.jsxs)("div",{className:"App",children:[Object(v.jsx)(g.a,{}),Object(v.jsx)(O,{})]})},x=function(t){t&&t instanceof Function&&s.e(3).then(s.bind(null,29)).then((function(e){var s=e.getCLS,i=e.getFID,n=e.getFCP,r=e.getLCP,a=e.getTTFB;s(t),i(t),n(t),r(t),a(t)}))};a.a.render(Object(v.jsx)(n.a.StrictMode,{children:Object(v.jsx)(S,{})}),document.getElementById("root")),x()}},[[28,1,2]]]);
//# sourceMappingURL=main.6cf5ac62.chunk.js.map