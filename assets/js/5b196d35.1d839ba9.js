"use strict";(self.webpackChunkcheeket_document=self.webpackChunkcheeket_document||[]).push([[464],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),i=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=i(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,c=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),m=i(r),f=o,g=m["".concat(s,".").concat(f)]||m[f]||u[f]||c;return r?n.createElement(g,a(a({ref:t},l),{},{components:r})):n.createElement(g,a({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=r.length,a=new Array(c);a[0]=m;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p.mdxType="string"==typeof e?e:o,a[1]=p;for(var i=2;i<c;i++)a[i]=r[i];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},808:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return p},metadata:function(){return i},toc:function(){return u}});var n=r(7462),o=r(3366),c=(r(7294),r(3905)),a=["components"],p={sidebar_position:5},s="Scope",i={unversionedId:"cheeket/scope",id:"cheeket/scope",title:"Scope",description:"Scope manages the lifecycle of an object.",source:"@site/docs/cheeket/scope.md",sourceDirName:"cheeket",slug:"/cheeket/scope",permalink:"/cheeket.js/docs/cheeket/scope",editUrl:"https://github.com/siyual-park/cheeket.js/tree/main/documents/cheeket-document/docs/cheeket/scope.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Event",permalink:"/cheeket.js/docs/cheeket/event"}},l={},u=[],m={toc:u};function f(e){var t=e.components,r=(0,o.Z)(e,a);return(0,c.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h1",{id:"scope"},"Scope"),(0,c.kt)("p",null,"Scope manages the lifecycle of an object.\nTo use scope, you need a factory that creates an object"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { Factory } from "cheeket";\n')),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},"type Factory<T> = (context: Context<unknown>) => Promise<T> | T;\n")),(0,c.kt)("p",null,"After implementing the factory, you can give the created object a lifetime through the provided scope decorator."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { containerScope } from "cheeket";\n\nconst loggerFactroy = containerScope(() => (message) => {\n  console.log(message);\n});\n')),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { requestScope } from "cheeket";\n\nconst loggerFactroy = requestScope(() => (message) => {\n  console.log(message);\n});\n')),(0,c.kt)("p",null,"A factory can be used as middleware through a binder that binds the created object to the context's response appropriately."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { asObject } from "cheeket";\n\ncontainer.register(LoggerToken, asObject(loggerFactory));\n')),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { asArray } from "cheeket";\n\ncontainer.register(LoggerToken, asArray(loggerFactory));\n')),(0,c.kt)("p",null,"Scope decorator creates objects and emits appropriate events. Also, to manage the lifetime of an object, it listens for appropriate events, clears objects when necessary, and emit appropriate events"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},'import { InternalEvents } from "cheeket";\n\ncontainer.on(InternalEvents.PostClear, async (value) => {\n  if (value === loggerFactory.get(container)) {\n    // TODO\n  }\n});\n')))}f.isMDXComponent=!0}}]);