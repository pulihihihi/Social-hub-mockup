const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CfBR8A1e.js","assets/react-core-W-ncL0vz.js","assets/ai-skill-BPjiUev9.js","assets/antd-stack-DUeaSnbb.js","assets/vendor-N3Cj6ZrL.js","assets/dayjs-CRDOnbOd.js","assets/antd-pro-DC5z67hQ.js","assets/router-Be325nFG.js","assets/ai-skill-C1fWlV54.css","assets/PublishingFilterBar-gyCwAFSQ.js","assets/PublishingFilterBar-DECsF2fe.css","assets/tagManagementStore-CoU70UHB.js","assets/messageTypes-DvMx5KKN.js","assets/publishingTaxonomy-BUvUwM1Z.js","assets/smartInboxMockData-C8I9YmbA.js","assets/SmartInboxAllMessages-QehRqsLJ.css","assets/index-VwaBRpk-.js","assets/index-C4BnaCWL.js","assets/index-DmoPznYi.js","assets/index-CQYHAYMA.js","assets/userManagement-C9StmDgY.js","assets/index-CRXUPkbk.js","assets/SharedBadges-DAu_UEwJ.js","assets/assetLibraryUtils-DdfPuE_b.js","assets/approvalWorkflowStore-B9VIuLwI.js","assets/index-DDXoDc_q.css","assets/index-B-YlPEpf.js","assets/calendarMockData-D8FXmN-0.js","assets/index-CAHvx7QI.css","assets/index-BTCENwV0.js","assets/PublishingFilterBar.utils-DUDpRGwf.js","assets/index-DcV_97B2.css","assets/index-DFUpFOXg.js","assets/PublishingNeedsApproval-BMFnDJjP.css","assets/index-DpXUQzvf.js","assets/index-3Hv1_8AO.js","assets/PublishingPostStatus-1O-9BC2n.js","assets/PublishingPostStatus-D0SDISxi.css","assets/index-C1qROm79.js","assets/index-2yE4Kn8S.js","assets/PublishingCampaignCreateMenu-DQsDrJFD.js","assets/publishingCampaignStore-D4pUEYgJ.js","assets/PublishingCampaignsShared-d9ROOtnw.css","assets/index-BSOkkCqj.js","assets/index-Dfhs9lgK.js","assets/index-DBYCbaqn.js","assets/index-CV6L9Ikn.js","assets/index-Co3-Zg61.css","assets/index-wnWBbjzO.js","assets/index-D6b_qApZ.css","assets/index-BwO8YYxl.js","assets/AppProTable-BL3nCst4.js","assets/AppModalForm-0XC7d09X.js","assets/ChannelsPage-CIhEb4Oh.js","assets/index-Y2GgA83-.js","assets/idSort-hNoWqgWJ.js","assets/index-Ck9Lfw8V.css","assets/index-BqwEwOsA.js","assets/index-CD01vhKV.css","assets/index-BQRUTeW5.js","assets/index-DhjdDdr-.js"])))=>i.map(i=>d[i]);
import{R as g,r as m,j as r,e as ge}from"./react-core-W-ncL0vz.js";import{bc as A,a2 as be,be as fe,b8 as Ie,aS as q,bf as _e,bg as Se,$ as ye,bh as J,bi as Ee,ai as K,aV as Te,aF as Pe,aI as xe,bj as Ce,B as M,aC as Ae,bk as ae,S as ve,f as D,an as Ne,h as Oe,Z as we,c as Re,av as Le,o as Ge,bl as De,y as Be,R as Me,C as ke,bm as je}from"./antd-stack-DUeaSnbb.js";import{d as W}from"./dayjs-CRDOnbOd.js";import{T as c,u as He,C as T,A as Ue,a as $e,b as Ve}from"./ai-skill-BPjiUev9.js";import{a as oe,u as ze,b as Fe,N as G,B as Ye}from"./router-Be325nFG.js";import{a as Ke}from"./antd-pro-DC5z67hQ.js";import"./vendor-N3Cj6ZrL.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&a(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();const We="modulepreload",Xe=function(e){return"/"+e},Q={},b=function(n,t,a){let o=Promise.resolve();if(t&&t.length>0){let h=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(I=>({status:"fulfilled",value:I}),I=>({status:"rejected",reason:I}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),p=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=h(t.map(d=>{if(d=Xe(d),d in Q)return;Q[d]=!0;const u=d.endsWith(".css"),I=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${I}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":We,u||(f.as="script"),f.crossOrigin="",f.href=d,p&&f.setAttribute("nonce",p),document.head.appendChild(f),u)return new Promise((_,j)=>{f.addEventListener("load",_),f.addEventListener("error",()=>j(new Error(`Unable to preload CSS for ${d}`)))})}))}function l(h){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=h,window.dispatchEvent(i),!i.defaultPrevented)throw h}return o.then(h=>{for(const i of h||[])i.status==="rejected"&&l(i.reason);return n().catch(l)})},s={SMART_INBOX_ALL_MESSAGES:"smart_inbox_all_messages",SMART_INBOX_PRIVATE:"smart_inbox_private",SMART_INBOX_COMPLETED:"smart_inbox_completed",SMART_INBOX_SAVED_MESSAGES:"smart_inbox_saved_messages",SMART_INBOX_REPLY_APPROVALS:"smart_inbox_reply_approvals",PUBLISHING_NEW_POST:"publishing_new_post",PUBLISHING_CALENDAR:"publishing_calendar",PUBLISHING_DRAFTS:"publishing_drafts",PUBLISHING_NEEDS_APPROVAL:"publishing_needs_approval",PUBLISHING_REJECTED:"publishing_rejected",PUBLISHING_FAILED_POSTS:"publishing_failed_posts",PUBLISHING_DELETED_POSTS:"publishing_deleted_posts",PUBLISHING_CAMPAIGNS_ACTIVE:"publishing_campaigns_active",PUBLISHING_CAMPAIGNS_ARCHIVED:"publishing_campaigns_archived",PUBLISHING_CAMPAIGN_CREATE:"publishing_campaign_create",PUBLISHING_CAMPAIGN_PLANNER:"publishing_campaign_planner",PUBLISHING_ASSET_LIBRARY:"publishing_asset_library",BOTS:"bots",ALERTS:"alerts",CHANNELS:"channels",TAG_MANAGEMENT:"tag_management",APPROVAL_WORKFLOWS:"approval_workflows",NOTIFICATIONS:"notifications",AI_SKILL:"ai_skill",SYSTEM:"system"},qe=g.lazy(()=>b(()=>import("./index-CfBR8A1e.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]))),Je=g.lazy(()=>b(()=>import("./index-VwaBRpk-.js"),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,12,14,15]))),Qe=g.lazy(()=>b(()=>import("./index-C4BnaCWL.js"),__vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,15]))),Ze=g.lazy(()=>b(()=>import("./index-DmoPznYi.js"),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,15]))),en=g.lazy(()=>b(()=>import("./index-CQYHAYMA.js"),__vite__mapDeps([19,1,2,3,4,5,6,7,8,9,10,20,15]))),nn=g.lazy(()=>b(()=>import("./index-CRXUPkbk.js"),__vite__mapDeps([21,1,2,3,4,5,6,7,8,22,23,11,12,13,9,10,24,20,25]))),tn=g.lazy(()=>b(()=>import("./index-B-YlPEpf.js"),__vite__mapDeps([26,1,5,3,4,2,6,7,8,27,22,9,10,11,12,13,28]))),an=g.lazy(()=>b(()=>import("./index-BTCENwV0.js"),__vite__mapDeps([29,1,2,3,4,5,6,7,8,9,10,30,11,12,13,20,31]))),on=g.lazy(()=>b(()=>import("./index-DFUpFOXg.js"),__vite__mapDeps([32,1,2,3,4,5,6,7,8,9,10,30,11,12,13,24,20,33]))),rn=g.lazy(()=>b(()=>import("./index-DpXUQzvf.js"),__vite__mapDeps([34,1,2,3,4,5,6,7,8,9,10,30,11,12,13,24,20,33]))),sn=g.lazy(()=>b(()=>import("./index-3Hv1_8AO.js"),__vite__mapDeps([35,36,1,2,3,4,5,6,7,8,9,10,30,11,12,13,37]))),ln=g.lazy(()=>b(()=>import("./index-C1qROm79.js"),__vite__mapDeps([38,36,1,2,3,4,5,6,7,8,9,10,30,11,12,13,37]))),cn=g.lazy(()=>b(()=>import("./index-2yE4Kn8S.js"),__vite__mapDeps([39,1,2,3,4,5,6,7,8,40,11,12,41,42]))),dn=g.lazy(()=>b(()=>import("./index-BSOkkCqj.js"),__vite__mapDeps([43,1,2,3,4,5,6,7,8,40,11,12,41,42]))),pn=g.lazy(()=>b(()=>import("./index-Dfhs9lgK.js"),__vite__mapDeps([44,1,2,3,4,5,6,7,8,41,11,12,42]))),un=g.lazy(()=>b(()=>import("./index-DBYCbaqn.js"),__vite__mapDeps([45,1,2,3,4,5,6,7,8,11,12,42]))),hn=g.lazy(()=>b(()=>import("./index-CV6L9Ikn.js"),__vite__mapDeps([46,1,2,3,4,5,6,7,8,9,10,30,11,12,13,23,47]))),mn=g.lazy(()=>b(()=>import("./index-wnWBbjzO.js"),__vite__mapDeps([48,1,2,3,4,5,6,7,8,49]))),gn=g.lazy(()=>b(()=>import("./index-BwO8YYxl.js"),__vite__mapDeps([50,1,5,2,3,4,6,7,8,51,52]))),bn=g.lazy(()=>b(()=>import("./ChannelsPage-CIhEb4Oh.js"),__vite__mapDeps([53,1,2,3,4,5,6,7,8,22,51,52,20]))),fn=g.lazy(()=>b(()=>import("./index-Y2GgA83-.js"),__vite__mapDeps([54,1,5,2,3,4,6,7,8,51,27,11,12,55,56]))),In=g.lazy(()=>b(()=>import("./index-BqwEwOsA.js"),__vite__mapDeps([57,1,2,3,4,5,6,7,8,51,24,20,55,58]))),_n=g.lazy(()=>b(()=>import("./index-BQRUTeW5.js"),__vite__mapDeps([59,1,2,3,4,5,6,7,8,20]))),Sn=g.lazy(()=>b(()=>import("./ai-skill-BPjiUev9.js").then(e=>e.L),__vite__mapDeps([2,1,3,4,5,6,7,8]))),yn=g.lazy(()=>b(()=>import("./index-DhjdDdr-.js"),__vite__mapDeps([60,1,2,3,4,5,6,7,8,22,51,52,55,20]))),w=[{key:s.SMART_INBOX_ALL_MESSAGES,path:"/messages/smart",label:"All Messages",breadcrumbParent:"Smart Inbox",sidebarSection:"action",showInMenu:!0,menuOrder:1,menuIcon:A,component:qe},{key:s.SMART_INBOX_PRIVATE,path:"/messages/private",label:"Private",breadcrumbParent:"Smart Inbox",sidebarSection:"action",showInMenu:!0,menuOrder:2,menuIcon:A,component:Je},{key:s.SMART_INBOX_COMPLETED,path:"/messages/completed",label:"Completed",breadcrumbParent:"Smart Inbox",sidebarSection:"action",showInMenu:!0,menuOrder:3,menuIcon:A,component:Qe},{key:s.SMART_INBOX_SAVED_MESSAGES,path:"/messages/saved",label:"Saved Messages",breadcrumbParent:"Smart Inbox",sidebarSection:"action",showInMenu:!0,menuOrder:4,menuIcon:A,component:Ze},{key:s.SMART_INBOX_REPLY_APPROVALS,path:"/messages/reply-approvals",label:"Reply Approvals",breadcrumbParent:"Smart Inbox",sidebarSection:"action",showInMenu:!0,menuOrder:5,menuIcon:A,component:en},{key:s.PUBLISHING_NEW_POST,path:"/publishing/new-post",label:"New Post",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:1,menuIcon:be,component:nn},{key:s.PUBLISHING_CALENDAR,path:"/publishing/calendar",label:"Calendar",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:2,menuIcon:fe,component:tn},{key:s.PUBLISHING_DRAFTS,path:"/publishing/drafts",label:"Drafts",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:3,menuIcon:Ie,component:an},{key:s.PUBLISHING_NEEDS_APPROVAL,path:"/publishing/needs-approval",label:"Needs Approval",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:4,menuIcon:q,component:on},{key:s.PUBLISHING_REJECTED,path:"/publishing/rejected",label:"Rejected",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:5,menuIcon:_e,component:rn},{key:s.PUBLISHING_FAILED_POSTS,path:"/publishing/failedposts",label:"Failed Posts",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:6,menuIcon:Se,component:sn},{key:s.PUBLISHING_DELETED_POSTS,path:"/publishing/deletedposts",label:"Deleted Posts",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:7,menuIcon:ye,component:ln},{key:s.PUBLISHING_CAMPAIGNS_ACTIVE,path:"/publishing/campaigns/active",label:"Tag Groups",breadcrumbParent:"Tag Management",sidebarSection:"action",showInMenu:!1,menuOrder:8,menuIcon:null,component:cn},{key:s.PUBLISHING_CAMPAIGNS_ARCHIVED,path:"/publishing/campaigns/archived",label:"Archived Tag Groups",breadcrumbParent:"Tag Management",sidebarSection:"action",showInMenu:!1,menuOrder:9,menuIcon:null,component:dn},{key:s.PUBLISHING_CAMPAIGN_CREATE,path:"/publishing/campaigns/new",label:"Add Tag Group",breadcrumbParent:"Tag Management",sidebarSection:"action",showInMenu:!1,menuOrder:0,menuIcon:null,component:pn},{key:s.PUBLISHING_CAMPAIGN_PLANNER,path:"/publishing/campaigns/planner/:campaignId",label:"Tag Group Planner",breadcrumbParent:"Tag Management",sidebarSection:"action",showInMenu:!1,menuOrder:0,menuIcon:null,component:un},{key:s.PUBLISHING_ASSET_LIBRARY,path:"/publishing/asset-library",label:"Asset Library",breadcrumbParent:"Publishing",sidebarSection:"action",showInMenu:!0,menuOrder:10,menuIcon:null,component:hn},{key:s.BOTS,path:"/bots",label:"Bots",breadcrumbParent:null,sidebarSection:"action",showInMenu:!0,menuOrder:11,menuIcon:J,component:mn},{key:s.ALERTS,path:"/alerts",label:"Alerts",breadcrumbParent:"Settings",sidebarSection:"action",showInMenu:!0,menuOrder:1,menuIcon:Ee,component:gn},{key:s.CHANNELS,path:"/settings/channels",label:"Channels",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:1,menuIcon:K,component:bn},{key:s.TAG_MANAGEMENT,path:"/settings/tag-management",label:"Tag Management",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:3,menuIcon:Te,component:fn},{key:s.APPROVAL_WORKFLOWS,path:"/settings/approval-workflows",label:"Approval Workflows",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:4,menuIcon:q,component:In},{key:s.NOTIFICATIONS,path:"/settings/notifications",label:"Notifications",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:5,menuIcon:Pe,component:_n},{key:s.AI_SKILL,path:"/settings/ai-skill",label:"AI Skill",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:6,menuIcon:J,component:Sn},{key:s.SYSTEM,path:"/settings/system",label:"Access",breadcrumbParent:"Settings",sidebarSection:"settings",showInMenu:!0,menuOrder:7,menuIcon:xe,component:yn}],En={"/messages":"/messages/smart","/smart-inbox/all-messages":"/messages/smart","/smart-inbox/private":"/messages/private","/smart-inbox/completed":"/messages/completed","/smart-inbox/saved-messages":"/messages/saved","/smart-inbox/reply-approvals":"/messages/reply-approvals","/publishing":"/publishing/calendar","/publishing/campaigns/active":"/settings/tag-management?tab=groups&status=active","/publishing/campaigns/archived":"/settings/tag-management?tab=groups&status=archived","/publishing/campaigns/new":"/settings/tag-management?tab=groups&action=add","/publishing/campaigns/assets":"/publishing/asset-library","/publishing/failed-posts":"/publishing/failedposts","/publishing/deleted-posts":"/publishing/deletedposts","/settings/credentials":"/settings/channels"},re=Object.fromEntries(w.map(e=>[e.key,e.path]));Object.fromEntries(w.map(e=>[e.key,e]));Object.fromEntries(w.map(e=>[e.path,e]));const Tn=s.PUBLISHING_CALENDAR,V=re[Tn],Pn="/settings/channels",xn="/settings/channels?tab=groups",X="socialhub.channelGroups.v1",z="socialhub:channel-groups-changed",se="socialhub.activeChannelGroup.v1",v={singular:"Channel",plural:"Channels",lowerSingular:"channel",lowerPlural:"channels",groupSingular:"Channel Group",lowerGroupPlural:"channel groups"},F=[{value:"blue",label:"Blue",solid:"#1677ff",bg:"#e6f4ff",border:"#91caff",text:"#0958d9",selectedBg:"#bae0ff",selectedBorder:"#69b1ff",selectedText:"#003eb3"},{value:"geekblue",label:"Geek Blue",solid:"#2f54eb",bg:"#f0f5ff",border:"#adc6ff",text:"#1d39c4",selectedBg:"#d6e4ff",selectedBorder:"#85a5ff",selectedText:"#10239e"},{value:"cyan",label:"Cyan",solid:"#13c2c2",bg:"#e6fffb",border:"#87e8de",text:"#08979c",selectedBg:"#b5f5ec",selectedBorder:"#5cdbd3",selectedText:"#006d75"},{value:"green",label:"Green",solid:"#52c41a",bg:"#f6ffed",border:"#b7eb8f",text:"#389e0d",selectedBg:"#d9f7be",selectedBorder:"#95de64",selectedText:"#237804"},{value:"lime",label:"Lime",solid:"#a0d911",bg:"#fcffe6",border:"#d3f261",text:"#7cb305",selectedBg:"#f4ffb8",selectedBorder:"#bae637",selectedText:"#5b8c00"},{value:"gold",label:"Gold",solid:"#faad14",bg:"#fffbe6",border:"#ffe58f",text:"#d48806",selectedBg:"#fff1b8",selectedBorder:"#ffd666",selectedText:"#ad6800"},{value:"orange",label:"Orange",solid:"#fa8c16",bg:"#fff7e6",border:"#ffd591",text:"#d46b08",selectedBg:"#ffe7ba",selectedBorder:"#ffc069",selectedText:"#ad4e00"},{value:"volcano",label:"Volcano",solid:"#fa541c",bg:"#fff2e8",border:"#ffbb96",text:"#d4380d",selectedBg:"#ffd8bf",selectedBorder:"#ff9c6e",selectedText:"#ad2102"},{value:"red",label:"Red",solid:"#f5222d",bg:"#fff1f0",border:"#ffa39e",text:"#cf1322",selectedBg:"#ffccc7",selectedBorder:"#ff7875",selectedText:"#a8071a"},{value:"magenta",label:"Magenta",solid:"#eb2f96",bg:"#fff0f6",border:"#ffadd2",text:"#c41d7f",selectedBg:"#ffd6e7",selectedBorder:"#ff85c0",selectedText:"#9e1068"},{value:"purple",label:"Purple",solid:"#722ed1",bg:"#f9f0ff",border:"#d3adf7",text:"#531dab",selectedBg:"#efdbff",selectedBorder:"#b37feb",selectedText:"#391085"}],le="blue",B={"Chien Than Delta Force":"volcano","Garena Delta Force VN":"blue","Delta Force Launch":"gold"},Ot=(e,{lower:n=!1}={})=>{const t=e===1?n?v.lowerSingular:v.singular:n?v.lowerPlural:v.plural;return`${e} ${t}`},Cn=[{id:1,name:"Chien Than Delta Force",color:B["Chien Than Delta Force"],channelIds:["fb-warrior","ig-warrior","yt-warrior","tt-warrior"]},{id:2,name:"Garena Delta Force VN",color:B["Garena Delta Force VN"],channelIds:["fb-delta-main","ig-delta","yt-delta","tt-delta"]},{id:3,name:"Delta Force Launch",color:B["Delta Force Launch"],channelIds:["fb-delta-main","fb-warrior","ig-delta","yt-delta"]}],R=[{id:"fb-delta-main",platform:"facebook",platformKey:"fb_fanpage",name:"Garena Delta Force (VN - Vietnamese)",handle:"GarenaDeltaForceVN",channelId:"GarenaDeltaForceVN",channelGroupId:2,channelGroupIds:[2,3],selected:!0,avatarColor:"#123f57",mode:"API",health:"CONNECTED"},{id:"fb-warrior",platform:"facebook",platformKey:"fb_fanpage",name:"Chien Than Delta Force",handle:"chienthanDF",channelId:"chienthanDF",channelGroupId:1,channelGroupIds:[1,3],selected:!1,avatarColor:"#214c78",mode:"API",health:"CONNECTED"},{id:"ig-warrior",platform:"instagram",platformKey:"instagram",name:"Chien Than Delta Force",handle:"@chienthandf",channelId:"chienthandf",channelGroupId:1,channelGroupIds:[1],selected:!0,disabled:!0,issue:"Reconnect required",avatarColor:"#d79bb7",mode:"API",health:"DISCONNECTED"},{id:"ig-delta",platform:"instagram",platformKey:"instagram",name:"Garena Delta Force VN",handle:"@garenadeltaforcevn",channelId:"garenadeltaforcevn",channelGroupId:2,channelGroupIds:[2,3],selected:!0,disabled:!0,issue:"Reconnect required",avatarColor:"#c9939a",mode:"API",health:"DISCONNECTED"},{id:"ig-alt",platform:"instagram",platformKey:"instagram",name:"@garenadeltaforcevn",handle:"Instagram Channel",channelId:"garenadeltaforcevn-alt",channelGroupId:null,channelGroupIds:[],selected:!1,avatarColor:"#29313a",mode:"API",health:"CONNECTED"},{id:"threads-delta",platform:"threads",platformKey:"threads",name:"Garena Delta Force VN",handle:"Threads Channel",channelId:"garenadeltaforcevn",channelGroupId:null,channelGroupIds:[],selected:!1,avatarColor:"#111827",mode:"API",health:"CONNECTED"},{id:"threads-warrior",platform:"threads",platformKey:"threads",name:"Chien Than Delta Force",handle:"@chienthandf",channelId:"chienthandf",channelGroupId:null,channelGroupIds:[],selected:!1,avatarColor:"#24292f",mode:"API",health:"CONNECTED"},{id:"yt-warrior",platform:"youtube",platformKey:"youtube",name:"Chien Than Delta Force",handle:"@chienthandeltaforce",channelId:"chienthandeltaforce",channelGroupId:1,channelGroupIds:[1],selected:!0,disabled:!0,issue:"Reconnect required",avatarColor:"#6a7788",mode:"API",health:"DISCONNECTED"},{id:"yt-delta",platform:"youtube",platformKey:"youtube",name:"Garena Delta Force VN",handle:"@garenadeltaforcevn",channelId:"garenadeltaforcevn",channelGroupId:2,channelGroupIds:[2,3],selected:!0,avatarColor:"#91a0ad",mode:"API",health:"CONNECTED"},{id:"tt-warrior",platform:"tiktok",platformKey:"tiktok",name:"Chien Than Delta Force",handle:"@chienthandf",channelId:"chienthandf",channelGroupId:1,channelGroupIds:[1],selected:!0,avatarColor:"#111827",mode:"API",health:"CONNECTED"},{id:"tt-delta",platform:"tiktok",platformKey:"tiktok",name:"Garena Delta Force VN",handle:"@garenadeltaforcevn",channelId:"garenadeltaforcevn",channelGroupId:2,channelGroupIds:[2],selected:!0,avatarColor:"#374151",mode:"API",health:"CONNECTED"}],An=e=>B[e]||le,ie=(e,n="")=>F.some(t=>t.value===e)?e:An(n),k=(e,n="")=>{const t=ie(e,n);return F.find(a=>a.value===t)||F.find(a=>a.value===le)},vn=(e,n="")=>{var t;return((t=k(e,n))==null?void 0:t.label)||"Blue"},Nn=(e="")=>String(e).split(/\s+/).filter(Boolean).slice(0,2).map(n=>n[0]).join("").toUpperCase(),On=(e={})=>({...e,color:ie(e.color,e.name),channelIds:Array.isArray(e.channelIds)?[...new Set(e.channelIds)]:[]}),x=(e=Cn)=>e.map(n=>On(n)),P=()=>{if(typeof window>"u")return x();try{const e=window.localStorage.getItem(X);if(!e)return x();const n=JSON.parse(e);return Array.isArray(n)?x(n):x()}catch{return x()}},wn=e=>{const n=x(e);return typeof window<"u"&&(window.localStorage.setItem(X,JSON.stringify(n)),window.setTimeout(()=>{window.dispatchEvent(new CustomEvent(z,{detail:{channelGroups:n}}))},0)),n},Rn=()=>{const[e,n]=m.useState(P);return m.useEffect(()=>{const a=o=>{var l;o.type==="storage"&&o.key!==X||n((l=o.detail)!=null&&l.channelGroups?x(o.detail.channelGroups):P())};return window.addEventListener(z,a),window.addEventListener("storage",a),()=>{window.removeEventListener(z,a),window.removeEventListener("storage",a)}},[]),[e,a=>{n(o=>{const l=typeof a=="function"?a(x(o)):a;return wn(l)})}]},Ln=(e,n=P())=>{const t=Array.isArray(e==null?void 0:e.channelGroupIds)?e.channelGroupIds:(e==null?void 0:e.channelGroupId)!==void 0&&(e==null?void 0:e.channelGroupId)!==null?[e.channelGroupId]:[],a=[...new Set(t.filter(o=>o!=null))];return a.length?a:n.filter(o=>(o.channelIds||[]).includes(e==null?void 0:e.id)).map(o=>o.id)},wt=(e,n=P())=>Ln(e,n).map(t=>{var a;return((a=n.find(o=>String(o.id)===String(t)))==null?void 0:a.name)||""}).filter(Boolean),Rt=(e,n=P())=>n.filter(t=>(t.channelIds||[]).includes(e)).map(t=>t.name),Y=(e=P())=>{var t;const n=e.find(a=>/Garena Delta Force VN/i.test(a.name));return(n==null?void 0:n.id)??((t=e[0])==null?void 0:t.id)??null},ce=(e=P())=>{if(!e.length)return null;if(typeof window>"u")return Y(e);const n=window.localStorage.getItem(se),t=e.find(a=>String(a.id)===String(n));return(t==null?void 0:t.id)??Y(e)},Z=e=>(typeof window<"u"&&window.localStorage.setItem(se,String(e)),e),Gn=e=>!!(e!=null&&e.disabled||(e==null?void 0:e.health)==="DISCONNECTED"),Dn=(e=R)=>e.filter(Gn).length,Bn=(e=ce(),n=P())=>{var t;return((t=n.find(a=>String(a.id)===String(e)))==null?void 0:t.channelIds)||[]},ee=e=>e==="fb_fanpage"?"facebook":e,H=e=>String(e||"").trim().replace(/^@+/,"").toLowerCase(),Mn=(e,n=R)=>{if(!e)return null;const t=e.sourceChannelId||e.channelValue||e.channelId||e.id;if(t&&n.some(i=>i.id===t))return t;const a=ee(e.platform||e.network||e.platformKey),o=H(e.channelName||e.account||e.channel||e.name),l=H(e.handle||e.accountHandle),h=n.find(i=>{const p=!a||ee(i.platformKey||i.platform)===a,d=[i.id,i.name,i.channelId,i.handle].map(H);return p&&(d.includes(o)||d.includes(l))});return(h==null?void 0:h.id)||null},Lt=(e,n,t=R)=>{const a=new Set(n||[]);return a.size?e.filter(o=>{const l=Mn(o,t);return l?a.has(l):!0}):[]},kn=({channelGroups:e=P(),channels:n=R,visibleChannelIds:t=null}={})=>{const a=["facebook","instagram","threads","youtube","tiktok"],o={facebook:"Facebook",instagram:"Instagram",threads:"Threads",youtube:"YouTube",tiktok:"TikTok"},l=t?new Set(t):null,h=l?n.filter(p=>l.has(p.id)):n;return[{label:"Channel Groups",value:"group-channel-groups",options:e.map(p=>({label:p.name,value:`channel-group-${p.id}`,initials:Nn(p.name),color:k(p.color,p.name).solid,channelGroup:p,channelIds:l?p.channelIds.filter(d=>l.has(d)):p.channelIds})).filter(p=>p.channelIds.length)},...a.map(p=>({label:o[p],value:`group-${p}`,network:p,options:h.filter(d=>d.platform===p).map(d=>({label:d.name,value:d.id,initials:d.name.replace("@","").split(/\s+/).slice(0,2).map(u=>u[0]).join("").toUpperCase(),color:d.avatarColor,platform:d.platform}))})).filter(p=>p.options.length)]},Gt=(e={})=>kn(e).flatMap(n=>[{label:n.label,value:n.value},...n.options]),jn=({actionLabel:e="View more",count:n,description:t,onAction:a,onClose:o,open:l=!0,title:h})=>{if(!l)return null;const i=n??0,p=h||`${i} of your ${v.lowerPlural} have been disconnected`,d=t||`It looks like ${i} of your selected ${v.lowerPlural} need reauthorization.`;return r.jsxs("div",{className:"global-operational-notice",role:"alert","aria-live":"assertive",children:[r.jsx("span",{className:"global-operational-notice-accent","aria-hidden":"true"}),r.jsx(Ce,{className:"global-operational-notice-icon"}),r.jsxs("div",{className:"global-operational-notice-content",children:[r.jsx("div",{className:"global-operational-notice-title",children:p}),r.jsx("div",{className:"global-operational-notice-description",children:d}),e?r.jsx(M,{type:"link",className:"global-operational-notice-action",onClick:a,children:e}):null]}),r.jsx(M,{"aria-label":"Dismiss notification",className:"global-operational-notice-close",icon:r.jsx(Ae,{}),onClick:o,type:"text"})]})},ne={sm:{borderRadius:8,gap:6,iconSize:12,maxWidth:220,minHeight:30,padding:"4px 10px",textSize:c.fontSizeSM},md:{borderRadius:10,gap:8,iconSize:13,maxWidth:260,minHeight:36,padding:"6px 12px",textSize:c.fontSize}},Hn=({color:e,group:n,name:t})=>({color:(n==null?void 0:n.color)||e,name:(n==null?void 0:n.name)||t||""}),de=({color:e,group:n,maxWidth:t,name:a,selected:o=!1,size:l="sm",style:h})=>{const{color:i,name:p}=Hn({color:e,group:n,name:a}),d=k(i,p),u=ne[l]||ne.sm,I=o?d.selectedBorder:d.border,f=o?d.selectedBg:d.bg,_=o?d.selectedText:d.text;return r.jsxs("span",{title:p,style:{display:"inline-flex",alignItems:"center",gap:u.gap,maxWidth:t||u.maxWidth,minHeight:u.minHeight,padding:u.padding,borderRadius:u.borderRadius,border:`1px solid ${I}`,background:f,color:_,lineHeight:1.2,...h},children:[r.jsx(ae,{style:{color:_,flex:"0 0 auto",fontSize:u.iconSize}}),r.jsx("span",{style:{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:u.textSize,fontWeight:c.fontWeightStrong},children:p})]})},Dt=({groups:e=[],maxWidth:n,size:t="sm"})=>e.length?r.jsx(ve,{size:[6,6],wrap:!0,children:e.map(a=>r.jsx(de,{group:a,maxWidth:n,size:t},a.id||`${a.name}-${a.color}`))}):r.jsx("span",{style:{fontSize:c.fontSizeSM,color:c.colorTextTertiary},children:"-"}),Bt=({color:e,groupName:n})=>{const t=k(e,n),a=vn(e,n);return r.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8,minWidth:0},children:[r.jsx("span",{"aria-hidden":"true",style:{width:10,height:10,borderRadius:999,background:t.solid,flex:"0 0 auto",boxShadow:`0 0 0 2px ${t.bg}`}}),r.jsx("span",{style:{fontSize:c.fontSizeSM,color:c.colorTextBase,whiteSpace:"nowrap"},children:a})]})},pe=m.createContext(null),Un=()=>{const e=m.useContext(pe);if(!e)throw new Error("useChannelGroup must be used within ChannelGroupProvider");return e},{Text:$n}=D,Vn=()=>{const e=oe(),{activeChannelGroupId:n,channelGroups:t,setActiveChannelGroupId:a}=Un();if(!t.length)return null;const o=n==null?void 0:String(n),l=[...t.map(i=>({key:String(i.id),label:r.jsx(de,{group:i,maxWidth:248,selected:String(i.id)===o,size:"sm"})})),{type:"divider"},{key:"manage",icon:r.jsx(K,{}),label:"Manage Channel Groups"}],h=({key:i})=>{if(i==="manage"){e(xn);return}a(i)};return r.jsx(Ne,{trigger:["click"],placement:"bottomLeft",classNames:{root:"social-channel-group-dropdown"},menu:{items:l,onClick:h,selectable:!0,selectedKeys:o?[o]:[]},children:r.jsxs(M,{type:"text",className:"social-channel-group-trigger","aria-label":"Open channel group selector","aria-haspopup":"menu",children:[r.jsx(Oe,{dot:!0,offset:[-2,4],className:"social-channel-group-trigger-badge",children:r.jsx(we,{shape:"square",size:30,icon:r.jsx(ae,{}),className:"social-channel-group-trigger-icon"})}),r.jsx($n,{strong:!0,ellipsis:!0,className:"social-channel-group-trigger-title",children:"Channel Group"}),r.jsx(Re,{className:"social-channel-group-trigger-arrow","aria-hidden":"true"})]})})},zn=Object.fromEntries(w.map(e=>[e.key,e])),U={SMART_INBOX:"smart_inbox",PUBLISHING:"publishing",SETTINGS:"settings"},Fn=[s.SMART_INBOX_ALL_MESSAGES,s.SMART_INBOX_PRIVATE,s.SMART_INBOX_COMPLETED,s.SMART_INBOX_SAVED_MESSAGES,s.SMART_INBOX_REPLY_APPROVALS],Yn=[s.PUBLISHING_CALENDAR,s.PUBLISHING_NEW_POST,s.PUBLISHING_DRAFTS,s.PUBLISHING_NEEDS_APPROVAL,s.PUBLISHING_REJECTED,s.PUBLISHING_FAILED_POSTS,s.PUBLISHING_DELETED_POSTS,s.PUBLISHING_ASSET_LIBRARY],Kn=[s.CHANNELS,s.TAG_MANAGEMENT,s.APPROVAL_WORKFLOWS,s.NOTIFICATIONS,s.AI_SKILL,s.SYSTEM],N=e=>{const n=zn[e];if(!n)throw new Error(`Unknown sidebar route key: ${e}`);return n},O=e=>({key:e.key,path:e.path,name:e.label,icon:e.menuIcon}),Wn=()=>[{key:U.PUBLISHING,path:"/publishing",name:"Publishing",icon:Le,children:Yn.map(e=>O(N(e)))},{key:U.SMART_INBOX,path:"/messages",name:"Smart Inbox",icon:A,children:Fn.map(e=>O(N(e)))},O(N(s.BOTS)),O(N(s.ALERTS)),{key:U.SETTINGS,path:"/settings",name:"Settings",icon:K,children:Kn.map(e=>O(N(e)))}],te=e=>[e.startsWith("/messages/")?"/messages":null,e.startsWith("/publishing/")?"/publishing":null,e.startsWith("/settings/")?"/settings":null].filter(Boolean),Xn="/assets/social-hub-logo-mark.png",qn=`
  html[data-card-surface] .social-shell-layout .ant-pro-layout-content {
    background: #e9ebef !important;
  }

  .social-shell-layout .ant-pro-layout-bg-list {
    display: none;
  }

  .social-shell-layout .ant-layout-sider {
    box-shadow: none;
    z-index: 3;
  }

  .social-shell-layout .ant-pro-layout-content {
    padding-block: 0 24px;
    padding-inline: 0;
  }

  .social-page-secondary-host {
    width: 100%;
    min-width: 0;
    padding: ${c.padding}px ${c.paddingLG}px 0;
  }

  .social-page-secondary-host.is-page-header-hidden {
    padding-top: ${c.paddingXS}px;
  }

  .social-page-secondary-host:empty {
    display: none;
    padding: 0;
  }

  .social-shell-layout .ant-layout-sider .ant-menu-item,
  .social-shell-layout .ant-layout-sider .ant-menu-submenu-title {
    border-radius: 12px !important;
    margin-inline: 14px !important;
    width: calc(100% - 28px) !important;
  }

  .social-shell-layout .ant-layout-sider .ant-menu-sub.ant-menu-inline .ant-menu-item {
    padding-inline-start: 42px !important;
  }

  .social-shell-brand {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
    height: 40px;
    cursor: pointer;
  }

  .social-shell-brand.is-collapsed {
    justify-content: center;
  }

  .social-shell-brand-logo-mark {
    display: block;
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .social-shell-brand-wordmark {
    display: inline-flex;
    align-items: baseline;
    min-width: 0;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .social-shell-brand-wordmark-social {
    color: #fff;
  }

  .social-shell-brand-wordmark-hub {
    color: ${c.colorPrimary};
    margin-left: 4px;
  }

  .social-shell-brand-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-item,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-title {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 40px !important;
    height: 40px !important;
    margin-inline: 16px !important;
    padding-inline: 0 !important;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-item .anticon,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-title .anticon {
    margin-inline: 0 !important;
    font-size: 16px;
    line-height: 1;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-title-content,
  .social-shell-layout .ant-layout-sider-collapsed .ant-pro-base-menu-vertical-item-title-collapsed {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    min-width: 0;
    margin-inline: 0 !important;
    overflow: visible;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-pro-base-menu-vertical-item-text,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-arrow {
    display: none !important;
  }

  .social-shell-layout .ant-pro-sider-extra {
    width: 100% !important;
    margin-inline: 0 !important;
  }

  .social-channel-group-extra {
    padding: 0 14px 8px 6px;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link) {
    display: grid !important;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: auto !important;
    min-height: 50px;
    padding: 7px 10px 7px 7px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.26) !important;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)),
      rgba(255, 255, 255, 0.07) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.28) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    cursor: pointer;
    text-align: left;
    transition:
      background 0.16s ease,
      border-color 0.16s ease,
      box-shadow 0.16s ease,
      transform 0.16s ease;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link):hover,
  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link).ant-dropdown-open {
    border-color: rgba(47, 112, 255, 0.86) !important;
    background:
      linear-gradient(135deg, rgba(47, 112, 255, 0.24), rgba(255, 255, 255, 0.08)),
      rgba(47, 112, 255, 0.18) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 6px 18px rgba(0, 0, 0, 0.36) !important;
    color: #fff !important;
    transform: translateY(-1px);
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger:focus-visible {
    outline: 2px solid ${c.colorPrimary};
    outline-offset: 2px;
  }

  .social-channel-group-trigger-badge {
    line-height: 1;
  }

  .social-channel-group-trigger-badge .ant-badge-dot {
    width: 7px;
    min-width: 7px;
    height: 7px;
    background: #e044a7;
    box-shadow: 0 0 0 1px #141414;
  }

  .social-channel-group-trigger-icon {
    flex: 0 0 auto;
    width: 34px !important;
    height: 34px !important;
    border-radius: 9px !important;
    background: ${c.colorBgContainer} !important;
    color: ${c.colorPrimary} !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  }

  .social-channel-group-trigger-title.ant-typography {
    margin: 0;
    overflow: hidden;
    color: #fff;
    font-size: 13px;
    font-weight: ${c.fontWeightStrong};
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .social-channel-group-trigger-arrow {
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
    transition: color 0.16s ease, transform 0.16s ease;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger:hover .social-channel-group-trigger-arrow,
  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-dropdown-open .social-channel-group-trigger-arrow {
    color: #fff;
    transform: translateX(1px);
  }

  .social-channel-group-dropdown .ant-dropdown-menu {
    width: 300px;
    max-height: 360px;
    overflow: auto;
    padding: 6px;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item {
    min-height: 40px;
    padding: 6px 8px !important;
    border-radius: 8px !important;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-icon {
    color: ${c.colorPrimary};
  }

  .social-channel-group-menu-chip.ant-tag {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    padding: 3px 8px;
    overflow: hidden;
    border-color: ${c.colorBorderSecondary};
    border-radius: 6px;
    background: ${c.colorFillQuaternary};
    color: ${c.colorText};
    line-height: 20px;
  }

  .social-channel-group-menu-chip .anticon {
    flex: 0 0 auto;
    color: ${c.colorPrimary};
    font-size: 12px;
  }

  .social-channel-group-menu-chip-text {
    min-width: 0;
    overflow: hidden;
    color: inherit;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-selected .social-channel-group-menu-chip.ant-tag,
  .social-channel-group-dropdown .ant-dropdown-menu-item:hover .social-channel-group-menu-chip.ant-tag {
    border-color: ${c.colorPrimaryBorder};
    background: ${c.colorPrimaryBg};
    color: ${c.colorPrimary};
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-selected .social-channel-group-menu-chip .anticon,
  .social-channel-group-dropdown .ant-dropdown-menu-item:hover .social-channel-group-menu-chip .anticon {
    color: ${c.colorPrimary};
  }

  .social-page-top-slot .ant-tabs {
    margin: 0;
  }

  .social-page-top-slot .ant-tabs-nav {
    margin: 0 !important;
  }

  .social-page-top-slot .ant-tabs-nav::before {
    border-bottom: 1px solid ${c.colorBorderSecondary};
  }

  .social-page-top-slot .ant-tabs-tab {
    padding: 18px 0 16px !important;
    font-size: ${c.fontSizeLG}px;
  }

  .social-page-top-slot .ant-tabs-content-holder {
    display: none;
  }

  .social-page-top-slot .ant-tabs-extra-content,
  .social-page-top-slot .ant-tabs-nav-wrap {
    min-width: 0;
  }

  @media (max-width: 767px) {
    .social-shell-layout .ant-pro-layout-content {
      padding-bottom: 16px;
    }

    .social-page-secondary-host {
      padding-inline: ${c.paddingSM}px;
    }

    .social-page-top-slot .ant-tabs-tab {
      padding: 14px 0 12px !important;
      font-size: ${c.fontSize}px;
    }
  }
`,Jn={layout:{bgLayout:c.colorBgLayout,sider:{colorMenuBackground:T.sidebarBg,colorMenuItemDivider:T.sidebarBorder,colorTextMenu:"rgba(255,255,255,0.85)",colorTextMenuSecondary:T.sidebarWhite60,colorTextMenuTitle:"#fff",colorTextMenuItemHover:"#fff",colorTextMenuSelected:"#fff",colorBgMenuItemHover:T.sidebarOverlay10,colorBgMenuItemActive:T.sidebarOverlay10,colorBgMenuItemSelected:c.colorPrimary,paddingBlockLayoutMenu:c.paddingSM,paddingInlineLayoutMenu:c.paddingXS}}},Qn=e=>({backgroundColor:T.sidebarBg,[`& ${e.antCls}-layout-sider-children`]:{backgroundColor:T.sidebarBg,borderInlineEnd:`1px solid ${T.sidebarBorder}`},[`& ${e.antCls}-menu, & ${e.antCls}-menu-sub`]:{background:"transparent !important"},[`& ${e.antCls}-menu-item, & ${e.antCls}-menu-submenu-title`]:{color:"rgba(255,255,255,0.85)"},[`& ${e.antCls}-menu-item:hover, & ${e.antCls}-menu-submenu-title:hover`]:{color:"#fff !important",backgroundColor:T.sidebarOverlay10},[`& ${e.antCls}-menu-item-selected`]:{color:"#fff !important",backgroundColor:`${c.colorPrimary} !important`},[`& ${e.antCls}-menu-submenu-selected > ${e.antCls}-menu-submenu-title`]:{color:"#fff !important",backgroundColor:T.sidebarOverlay10},[`& ${e.antCls}-menu-item .anticon, & ${e.antCls}-menu-submenu-title .anticon`]:{color:"inherit"}}),ue=e=>{var n;return{path:e.path,name:e.name,icon:e.icon?m.createElement(e.icon):null,routes:(n=e.children)==null?void 0:n.map(ue)}},Zn=({children:e})=>{const n=ze(),t=oe(),{pageHeaderHidden:a,sidebarCollapsed:o,setSidebarCollapsed:l,registerTopBarHost:h,registerTopBarSecondaryHost:i}=He(),p=m.useMemo(()=>Wn().map(ue),[]),[d,u]=m.useState(()=>te(n.pathname)),[I,f]=m.useState(!0),_=m.useMemo(()=>Dn(),[]),j=_>0,me=()=>t(V);return m.useEffect(()=>{const S=te(n.pathname);S.length!==0&&u(C=>S.every(L=>C.includes(L))?C:[...new Set([...C,...S])])},[n.pathname]),r.jsxs(r.Fragment,{children:[r.jsx("style",{children:qn}),r.jsxs(Ke,{className:"social-shell-layout",layout:"side",navTheme:"light",splitMenus:!1,stylish:{sider:Qn},fixSiderbar:!0,headerRender:!1,siderWidth:232,collapsedWidth:72,collapsed:o,onCollapse:l,token:Jn,location:{pathname:n.pathname},route:{routes:p},menuProps:{selectedKeys:[n.pathname],openKeys:d,onOpenChange:S=>u(S)},menuExtraRender:()=>o?null:r.jsx("div",{className:"social-channel-group-extra",children:r.jsx(Vn,{})}),title:!1,logo:null,menuHeaderRender:()=>r.jsxs("div",{className:o?"social-shell-brand is-collapsed":"social-shell-brand",onClick:me,children:[r.jsx("img",{src:Xn,alt:"","aria-hidden":"true",className:"social-shell-brand-logo-mark"}),o?null:r.jsxs("span",{className:"social-shell-brand-wordmark","aria-hidden":"true",children:[r.jsx("span",{className:"social-shell-brand-wordmark-social",children:"Social"}),r.jsx("span",{className:"social-shell-brand-wordmark-hub",children:"Hub"})]}),r.jsx("span",{className:"social-shell-brand-sr",children:"Social Hub"})]}),menuItemRender:(S,C)=>{var L;return(L=S.routes)!=null&&L.length?C:r.jsx("span",{onClick:()=>S.path&&t(S.path),style:{display:"inline-flex",width:"100%"},children:C})},contentStyle:{background:c.colorBgLayout,minHeight:"100vh",color:c.colorTextBase},children:[r.jsxs("div",{className:a?"social-page-top-slot is-page-header-hidden":"social-page-top-slot",style:{position:"relative",background:a?"transparent":c.colorBgContainer,borderBottom:a?0:`1px solid ${c.colorBorderSecondary}`,boxShadow:a?"none":"0 1px 2px rgba(0,0,0,0.02)",minHeight:a?0:c.headerHeight,height:a?0:void 0,display:"flex",alignItems:"stretch",overflow:"visible"},children:[r.jsx("button",{type:"button","aria-label":o?"Expand sidebar":"Collapse sidebar",onClick:()=>l(S=>!S),style:{position:"absolute",top:10,left:0,transform:"translateX(-50%)",width:36,height:36,border:"none",borderRadius:"50%",background:c.colorBgContainer,color:c.colorTextSecondary,display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",cursor:"pointer",zIndex:c.zHeader+1},children:o?r.jsx(Ge,{}):r.jsx(De,{})}),r.jsx("div",{ref:h,style:{width:"100%",minWidth:0}})]}),r.jsx("div",{ref:i,className:a?"social-page-secondary-host is-page-header-hidden":"social-page-secondary-host"}),e]}),r.jsx(jn,{count:_,onAction:()=>t(Pn),onClose:()=>f(!1),open:I&&j})]})},et=r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},children:r.jsx(Be,{size:"large"})}),nt=({route:e})=>{const n=e.component;return r.jsx(m.Suspense,{fallback:et,children:r.jsx(n,{})})},tt=()=>{const e=Fe([{path:"/",element:r.jsx(G,{to:V,replace:!0})},{path:"/settings/users",element:r.jsx(G,{to:re[s.SYSTEM],replace:!0})},...Object.entries(En).map(([n,t])=>({path:n,element:r.jsx(G,{to:t,replace:!0})})),...w.map(n=>({path:n.path,element:r.jsx(nt,{route:n})})),{path:"*",element:r.jsx(G,{to:V,replace:!0})}]);return r.jsx(Zn,{children:e})},at=({children:e})=>{const[n,t]=m.useState(!1),[a,o]=m.useState(!1),[l,h]=m.useState(null),[i,p]=m.useState(null),d=m.useCallback(f=>{h(_=>_===f?_:f)},[]),u=m.useCallback(f=>{p(_=>_===f?_:f)},[]),I=m.useMemo(()=>({pageHeaderHidden:a,sidebarCollapsed:n,topBarHost:l,topBarSecondaryHost:i,setPageHeaderHidden:o,setSidebarCollapsed:t,registerTopBarHost:d,registerTopBarSecondaryHost:u,toggleSidebar:()=>t(f=>!f)}),[a,d,u,n,l,i]);return r.jsx(Ue.Provider,{value:I,children:e})},ot=({children:e})=>{const[n,t]=Rn(),[a,o]=m.useState(()=>ce(n));m.useEffect(()=>{if(!n.length){o(null);return}if(!n.some(I=>String(I.id)===String(a))){const I=Y(n);Z(I),o(I)}},[a,n]);const l=m.useCallback(u=>{Z(u),o(u)},[]),h=m.useMemo(()=>n.find(u=>String(u.id)===String(a))||null,[a,n]),i=m.useMemo(()=>Bn(a,n),[a,n]),p=m.useMemo(()=>R.filter(u=>i.includes(u.id)),[i]),d=m.useMemo(()=>({activeChannelGroup:h,activeChannelGroupId:a,activeChannelIds:i,activeChannels:p,channelGroups:n,setActiveChannelGroupId:l,setChannelGroups:t}),[h,a,i,p,n,l,t]);return r.jsx(pe.Provider,{value:d,children:e})},rt=m.createContext(null),st=[{id:"t1",name:"Espresso",description:"",status:"active",updateFrequency:"daily",dateRange:"27 Feb 2026 - Present",channels:[],keywords:[],alertRules:[]},{id:"t2",name:"Brand Health VN",description:"",status:"active",updateFrequency:"daily",dateRange:"15 Jan 2026 - Present",channels:[],keywords:[],alertRules:[]}],lt=e=>JSON.parse(JSON.stringify(e)),it={getTopics(){return lt(st)}},ct=e=>e.topics,dt=e=>e.topics.find(n=>n.id===e.activeTopicId)||null,pt=(e,n)=>e.topics.find(t=>t.id===n)||null,ut={ACTIVE:"active"},E={DAILY:"daily",ONE_HOUR:"1h",FOUR_HOURS:"4h"},ht=E.DAILY,$={[E.DAILY]:"Daily",[E.ONE_HOUR]:"1 hour",[E.FOUR_HOURS]:"4 hours"},Mt=[{label:$[E.ONE_HOUR],value:E.ONE_HOUR},{label:$[E.FOUR_HOURS],value:E.FOUR_HOURS},{label:$[E.DAILY],value:E.DAILY}],mt="en",gt=e=>W(e).locale(mt).format("D MMM YYYY"),y={HYDRATE:"HYDRATE",ADD_TOPIC:"ADD_TOPIC",UPDATE_TOPIC:"UPDATE_TOPIC",SET_TOPIC_STATUS:"SET_TOPIC_STATUS",DELETE_TOPIC:"DELETE_TOPIC",SET_ACTIVE_TOPIC:"SET_ACTIVE_TOPIC"},bt=e=>{const n=gt(W());return{id:`t${Date.now()}`,name:e.name,description:e.description||"",status:e.status||ut.ACTIVE,updateFrequency:e.updateFrequency||ht,dateRange:`${n} - Present`,channels:e.channels||[],keywords:e.keywords||[],alertRules:e.alertRules||[]}},he=e=>{var n;return{topics:e,activeTopicId:((n=e[0])==null?void 0:n.id)||null}},ft=(e,n,t)=>e.length?n!==t?n:e[0].id:null,It=(e,n)=>{switch(n.type){case y.HYDRATE:return he(n.payload||[]);case y.ADD_TOPIC:{const t=bt(n.payload);return{topics:[...e.topics,t],activeTopicId:t.id}}case y.UPDATE_TOPIC:{const t=e.topics.find(o=>o.id===n.payload.id);if(!t)return e;const a={...t,...n.payload,id:t.id,dateRange:n.payload.dateRange??t.dateRange,channels:n.payload.channels??t.channels,keywords:n.payload.keywords??t.keywords,alertRules:n.payload.alertRules??t.alertRules};return{topics:e.topics.map(o=>o.id===t.id?a:o),activeTopicId:t.id}}case y.SET_TOPIC_STATUS:{const t=e.topics.find(a=>a.id===n.payload.id);return t?{topics:e.topics.map(a=>a.id===t.id?{...a,status:n.payload.status}:a),activeTopicId:t.id}:e}case y.DELETE_TOPIC:{const t=e.topics.filter(a=>a.id!==n.payload);return t.length===e.topics.length?e:{topics:t,activeTopicId:ft(t,e.activeTopicId,n.payload)}}case y.SET_ACTIVE_TOPIC:return{...e,activeTopicId:n.payload};default:return e}},_t=({children:e})=>{const[n,t]=m.useReducer(It,it.getTopics(),he),a=m.useMemo(()=>({state:n,topics:ct(n),activeTopic:n.activeTopicId,activeTopicEntity:dt(n),setActiveTopic:o=>t({type:y.SET_ACTIVE_TOPIC,payload:o}),addTopic:o=>{t({type:y.ADD_TOPIC,payload:o})},updateTopic:o=>{t({type:y.UPDATE_TOPIC,payload:o})},setTopicStatus:(o,l)=>{t({type:y.SET_TOPIC_STATUS,payload:{id:o,status:l}})},deleteTopic:o=>{t({type:y.DELETE_TOPIC,payload:o})},getTopicById:o=>pt(n,o)}),[n]);return r.jsx(rt.Provider,{value:a,children:e})},St=({children:e})=>r.jsx(at,{children:r.jsx($e,{children:r.jsx(ot,{children:r.jsx(_t,{children:e})})})});class yt extends g.Component{constructor(n){super(n),this.state={error:null}}static getDerivedStateFromError(n){return{error:n}}render(){return this.state.error?r.jsxs(Me,{status:"error",title:"Page Error",subTitle:"Something went wrong while rendering this page.",extra:r.jsx(M,{type:"primary",onClick:()=>this.setState({error:null}),children:"Try Again"}),children:[r.jsx(D.Paragraph,{children:r.jsx(D.Text,{strong:!0,style:{fontSize:14},children:"Error Details:"})}),r.jsx(D.Paragraph,{children:r.jsxs("pre",{style:{whiteSpace:"pre-wrap",background:"#fff0f0",padding:16,borderRadius:8,fontSize:12},children:[this.state.error.message,`
`,this.state.error.stack]})})]}):this.props.children}}const Et=()=>r.jsx(St,{children:r.jsx(yt,{children:r.jsx(tt,{})})});W.locale("en");ge.createRoot(document.getElementById("root")).render(r.jsx(g.StrictMode,{children:r.jsx(ke,{theme:Ve,locale:je,children:r.jsx(Ye,{basename:"/",children:r.jsx(Et,{})})})}));export{v as C,ht as D,R as M,rt as T,Cn as a,de as b,Ot as c,xn as d,Pn as e,Lt as f,kn as g,Gt as h,$ as i,Mt as j,F as k,Bt as l,Rt as m,wt as n,Dt as o,Rn as p,le as q,ie as r,k as s,Un as u};
