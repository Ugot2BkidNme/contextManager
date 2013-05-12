/*! contextManager v1.0.0 Copyright (c) 2013 Ugot2BkidNme(Barry A. Rader)
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function (window, undefined) {
	this.contextManager = function () {
		var
			version = "1.0.0"
			,Contexts = {}
			,DefaultContextID = "en_US"
			,CurrentContextID = DefaultContextID
			,add = function (ID, object) {
				// first call to add will make sure the default context gets created we do not do this on creation in case the default is overwritten
				if (Contexts[DefaultContextID] === undefined) Contexts[DefaultContextID] = new ClientContext();
				if (Contexts[ID] === undefined) Contexts[ID] = new ClientContext();
				Contexts[ID].appendContext(object);
				return getContextByID(ID);
			}
			,setDefaultContext = function(ID) {
				DefaultContextID = ID
			}
			,setCurrentContext = function(ID) {
				CurrentContextID = ID
			}
			,getContextByID = function (ID) {
				if (Contexts[ID] !== undefined) return Contexts[ID];
				return null;
			}
			,getContextCount = function () { return Contexts.length; }
			//this will take an object with teh explicit variables or the variables for ease of use
			,getContextString = function (attribute, replacements, ID) {
				if (attribute === undefined) return;
				if (typeof attribute === "object") {
					ID  = (attribute.attribute !== undefined) ? attribute.ID : CurrentContextID;
					replacements = (attribute.replacements !== undefined) ? attribute.replacements : {};
					attribute = attribute.attribute;
				} else {
					ID = (ID !== undefined) ? ID : CurrentContextID;
					replacements = (replacements !== undefined) ? replacements : {};
				}
				var value;
				//if we find a return we use it
				if (getContextByID(ID).getAttribute(attribute)) {
					value = getContextByID(ID).getAttribute(attribute)
				} else if (getContextByID(DefaultContextID).getAttribute(attribute)) {
					value = getContextByID(DefaultContextID).getAttribute(attribute);
				} else {
					value = attribute;
				}
				if (typeof value === "string") {
					return replaceText(value, replacements);
				}
				if (value instanceof Function) {
					value(replacements);
					return;
				}
				return value;
			}
			,replaceText = function (text, replacements) {
				if (typeof replacements === 'object') {
					for (var propertyName in replacements) {
						text = text.replace(new RegExp('{' + propertyName + '}', 'g'), replacements[propertyName]);
					}
				}
				if(text.search(/<(.|\n)*?>/i) === -1) text = encodeHTML(text);
				return text;
			}
			//couresy of Chris from http://stackoverflow.com/questions/1354064/how-to-convert-characters-to-html-entities-using-plain-javascript
			,HTMLEntitiesTable = {34:'quot',38:'amp',39:'apos',60:'lt',62:'gt',160:'nbsp',161:'iexcl',162:'cent',163:'pound',164:'curren',165:'yen',166:'brvbar',167:'sect',168:'uml',169:'copy',170:'ordf',171:'laquo',172:'not',173:'shy',174:'reg',175:'macr',176:'deg',177:'plusmn',178:'sup2',179:'sup3',180:'acute',181:'micro',182:'para',183:'middot',184:'cedil',185:'sup1',186:'ordm',187:'raquo',188:'frac14',189:'frac12',190:'frac34',191:'iquest',192:'Agrave',193:'Aacute',194:'Acirc',195:'Atilde',196:'Auml',197:'Aring',198:'AElig',199:'Ccedil',200:'Egrave',201:'Eacute',202:'Ecirc',203:'Euml',204:'Igrave',205:'Iacute',206:'Icirc',207:'Iuml',208:'ETH',209:'Ntilde',210:'Ograve',211:'Oacute',212:'Ocirc',213:'Otilde',214:'Ouml',215:'times',216:'Oslash',217:'Ugrave',218:'Uacute',219:'Ucirc',220:'Uuml',221:'Yacute',222:'THORN',223:'szlig',224:'agrave',225:'aacute',226:'acirc',227:'atilde',228:'auml',229:'aring',230:'aelig',231:'ccedil',232:'egrave',233:'eacute',234:'ecirc',235:'euml',236:'igrave',237:'iacute',238:'icirc',239:'iuml',240:'eth',241:'ntilde',242:'ograve',243:'oacute',244:'ocirc',245:'otilde',246:'ouml',247:'divide',248:'oslash',249:'ugrave',250:'uacute',251:'ucirc',252:'uuml',253:'yacute',254:'thorn',255:'yuml',402:'fnof',913:'Alpha',914:'Beta',915:'Gamma',916:'Delta',917:'Epsilon',918:'Zeta',919:'Eta',920:'Theta',921:'Iota',922:'Kappa',923:'Lambda',924:'Mu',925:'Nu',926:'Xi',927:'Omicron',928:'Pi',929:'Rho',931:'Sigma',932:'Tau',933:'Upsilon',934:'Phi',935:'Chi',936:'Psi',937:'Omega',945:'alpha',946:'beta',947:'gamma',948:'delta',949:'epsilon',950:'zeta',951:'eta',952:'theta',953:'iota',954:'kappa',955:'lambda',956:'mu',957:'nu',958:'xi',959:'omicron',960:'pi',961:'rho',962:'sigmaf',963:'sigma',964:'tau',965:'upsilon',966:'phi',967:'chi',968:'psi',969:'omega',977:'thetasym',978:'upsih',982:'piv',8226:'bull',8230:'hellip',8242:'prime',8243:'Prime',8254:'oline',8260:'frasl',8472:'weierp',8465:'image',8476:'real',8482:'trade',8501:'alefsym',8592:'larr',8593:'uarr',8594:'rarr',8595:'darr',8596:'harr',8629:'crarr',8656:'lArr',8657:'uArr',8658:'rArr',8659:'dArr',8660:'hArr',8704:'forall',8706:'part',8707:'exist',8709:'empty',8711:'nabla',8712:'isin',8713:'notin',8715:'ni',8719:'prod',8721:'sum',8722:'minus',8727:'lowast',8730:'radic',8733:'prop',8734:'infin',8736:'ang',8743:'and',8744:'or',8745:'cap',8746:'cup',8747:'int',8756:'there4',8764:'sim',8773:'cong',8776:'asymp',8800:'ne',8801:'equiv',8804:'le',8805:'ge',8834:'sub',8835:'sup',8836:'nsub',8838:'sube',8839:'supe',8853:'oplus',8855:'otimes',8869:'perp',8901:'sdot',8968:'lceil',8969:'rceil',8970:'lfloor',8971:'rfloor',9001:'lang',9002:'rang',9674:'loz',9824:'spades',9827:'clubs',9829:'hearts',9830:'diams',338:'OElig',339:'oelig',352:'Scaron',353:'scaron',376:'Yuml',710:'circ',732:'tilde',8194:'ensp',8195:'emsp',8201:'thinsp',8204:'zwnj',8205:'zwj',8206:'lrm',8207:'rlm',8211:'ndash',8212:'mdash',8216:'lsquo',8217:'rsquo',8218:'sbquo',8220:'ldquo',8221:'rdquo',8222:'bdquo',8224:'dagger',8225:'Dagger',8240:'permil',8249:'lsaquo',8250:'rsaquo',8364:'euro'}
			,encodeHTML = function(string) {
				return string.replace(/[\u00A0-\u2666<>\&]/g, function(c) { return'&' + (HTMLEntitiesTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';} );
			}
			,decodeHTML = function decodeHTML (string){
				var converter = document.createElement("div");
				converter.innerHTML = string;
				var output = converter.innerHTML;
				converter = null;
				return output;
			}
			,ClientContext = function() {
				var
					appendContext = function (object) {
						if (typeof object == 'object') {
							for (var propertyName in object) {
								this[propertyName] = object[propertyName];
							}
						}
					}
					,getAttribute = function (attribute) {
						if (this[attribute] !== undefined) {
							return this[attribute];
						}
						return false
					}
				;
				return {
					appendContext: appendContext
					,getAttribute:  getAttribute
				}
			}
		;
		return {
			version: version
			,Contexts: Contexts
			,ClientContext: ClientContext
			,DefaultContextID: DefaultContextID
			,setDefaultContext: setDefaultContext
			,CurrentContextID: CurrentContextID
			,setCurrentContext: setCurrentContext
			,add: add
			,getContextByID: getContextByID
			,getContextCount: getContextCount
			,getContextString: getContextString
			,replaceText: replaceText
			,encodeHTML: encodeHTML
			,decodeHTML: decodeHTML
		}
	}
	window.contextManager = this.contextManager();
})(window);
