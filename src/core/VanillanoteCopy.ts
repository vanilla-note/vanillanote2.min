import {
    Vanillanote,
    VanillanoteConstructor,
    VanillanoteElement
} from './index'

//==================================================================================
//create vanilla note
//==================================================================================
function createVanillanote(vn: Vanillanote) {

    
    //element,variable
    var note: any, template: any, tool: any, textarea: any;
    var toolToggleButton: any, paragraphStyleSelect: any, paragraphStyleSelectBox: any, boldButton: any, underlineButton: any, italicButton: any;
    var ulButton: any, olButton: any, textAlignSelect: any, textAlignSelectBox
    var attLinkButton: any, attFileButton: any, attImageButton: any, attVideoButton: any;
    var fontSizeInputBox: any, fontSizeInput: any, letterSpacingInputBox: any, letterSpacingInput: any, lineHeightInputBox: any, lineHeightInput: any;
    var fontFamilySelect: any, fontFamilySelectBox: any, colorTextSelect: any, colorBackSelect
    var undoButton: any, redoButton: any, helpButton: any, formatClearButton: any;
    var colorTextSelectBox: any, colorText0: any, colorText1: any, colorText2: any, colorText3: any, colorText4: any, colorText5: any, colorText6: any, colorText7: any;
    var colorTextRInput: any, colorTextGInput: any, colorTextBInput: any, colorTextOpacityInput: any;
    var colorBackSelectBox: any, colorBack0: any, colorBack1: any, colorBack2: any, colorBack3: any, colorBack4: any, colorBack5: any, colorBack6: any, colorBack7: any;
    var colorBackRInput: any, colorBackGInput: any, colorBackBInput: any, colorBackOpacityInput: any;
    var modalBack: any, attLinkModal: any, attFileModal: any, attImageModal: any, attVideoModal: any, helpModal: any, helpMain: any, placeholder: any, placeholderColor: any, placeholderBackgroundColor: any;
    var attLinkText: any, attLinkHref: any, attLinkIsBlankCheckbox: any, attLinkValidCheckText: any, attLinkValidCheckbox: any, attLinkInsertButton: any;
     var attFilelayout: any, attFileUploadButton: any, attFileUploadDiv: any, attFileUpload: any, attFileInsertButton: any;
     var attImageUploadButtonAndView: any, attImageViewPreButtion: any, attImageViewNextButtion: any, attImageUpload: any, attImageURL: any, attImageInsertButton: any;
    var attLinkTooltip: any, attLinkTooltipHref: any, attLinkTooltipEditButton: any, attLinkTooltipUnlinkButton: any;
    var attVideoEmbedId: any, attVideoWidth: any, attVideoHeight: any, attVideoValidCheckText: any, attVideoValidCheckbox: any, attVideoInsertButton: any;
    var attImageAndVideoTooltip: any, attImageAndVideoTooltipWidthInput: any;
    var attImageAndVideoTooltipFloatRadioNone: any, attImageAndVideoTooltipFloatRadioLeft: any, attImageAndVideoTooltipFloatRadioRight: any;
    var attImageAndVideoTooltipShapeRadioSquare: any, attImageAndVideoTooltipShapeRadioRadius: any, attImageAndVideoTooltipShapeRadioCircle: any;
    var header: any;
    //colors
    var mainColor: any, colorSet: any, invertColor: any;
    //css
    var styleElement: any, cssKeys: any;
    var cssText = "";
    //icons
    var linkElementGoogleIcons: any, googleIcons: any;
    //attributes
    var noteModeByDevice: any, isNoteByMobile: any;
    var defaultFontSize: any, defaultLineHeight: any;
    var tempFontFamiliy: any, defaultFontFamilies: any, addFontFamilies: any, removeFontFamilies: any, defaultFontFamiliy: any;
    var sizeLevel: any, sizeLevelDesktop: any, sizeLevelMobile: any, textareaMaxWidth: any, textareaMaxHeight: any, textareaHeightIsModify: any;
    var defaultModalFontFamily
    var defaultAttImageAcceptTypes: any, attImageAcceptTypes: any;
    var placeholderTitle: any, placeholderTextContent: any;
    var usingParagraphStyle: any, usingBold: any, usingUnderline: any, usingItalic: any;
    var usingUl: any, usingOl: any, usingTextAlign: any;
    var usingAttLink: any, usingAttFile: any, usingAttImage: any, usingAttVideo: any;
    var usingFontSize: any, usingLetterSpacing: any, usingLineHeight: any;
    var usingFontFamily: any, usingColorText: any, usingColorBack: any, usingFormatClear: any;
    var usingUndo: any, usingRedo: any, usingHelp: any;
    
    //etc variable
    var tempElement1: any, tempElement2: any, tempElement3: any, tempText: any;


    var getNote = function() {return vn;};

        //==================================================================================
        //create element css text
        //element css
        cssKeys = Object.keys(vn.csses);
        for(var j = 0; j < cssKeys.length; j++) {
            cssText = cssText + getCssClassText(i, cssKeys[j], (vn.csses as any)[cssKeys[j]][i]) + "\n";
        }

        //==================================================================================
        //color text select
        colorTextSelect = createElementSelect(colorTextSelect, "span", vn.consts.CLASS_NAMES.colorTextSelect.id, vn.consts.CLASS_NAMES.colorTextSelect.className, i, {"isIcon":true, "text":"format_color_text", "iconStyle" : "-webkit-text-stroke: 0.5px black; font-size: 1.1em"});
        colorTextSelect.setAttribute("title",vn.languageSet[vn.variables.languages[i]].colorTextTooltip);	//COMMENT
        colorTextSelectBox = createElementSelectBox(colorTextSelectBox, "div", vn.consts.CLASS_NAMES.colorTextSelectBox.id, vn.consts.CLASS_NAMES.colorTextSelectBox.className, i);
        colorTextSelect.appendChild(colorTextSelectBox);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorTextRExplain.id, vn.consts.CLASS_NAMES.colorTextRExplain.className, i, {"isIcon":false, "text":"R"});	//COMMENT
        tempElement1.style.paddingLeft = (vn.variables.sizeRates[i] * 8) + "px";
        colorTextSelectBox.appendChild(tempElement1);
        colorTextRInput = createElementInput(colorTextRInput, vn.consts.CLASS_NAMES.colorTextRInput.id, vn.consts.CLASS_NAMES.colorTextRInput.className, i);
        colorTextRInput.setAttribute("maxlength", "2");
        addClickEvent(colorTextRInput, vn.consts.CLASS_NAMES.colorTextRInput.id);
        colorTextSelectBox.appendChild(colorTextRInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorTextGExplain.id, vn.consts.CLASS_NAMES.colorTextGExplain.className, i, {"isIcon":false, "text":"G"});	//COMMENT
        colorTextSelectBox.appendChild(tempElement1);
        colorTextGInput = createElementInput(colorTextGInput, vn.consts.CLASS_NAMES.colorTextGInput.id, vn.consts.CLASS_NAMES.colorTextGInput.className, i);
        colorTextGInput.setAttribute("maxlength", "2");
        addClickEvent(colorTextGInput, vn.consts.CLASS_NAMES.colorTextGInput.id);
        colorTextSelectBox.appendChild(colorTextGInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorTextBExplain.id, vn.consts.CLASS_NAMES.colorTextBExplain.className, i, {"isIcon":false, "text":"B"});	//COMMENT
        colorTextSelectBox.appendChild(tempElement1);
        colorTextBInput = createElementInput(colorTextBInput, vn.consts.CLASS_NAMES.colorTextBInput.id, vn.consts.CLASS_NAMES.colorTextBInput.className, i);
        colorTextBInput.setAttribute("maxlength", "2");
        addClickEvent(colorTextBInput, vn.consts.CLASS_NAMES.colorTextBInput.id);
        colorTextSelectBox.appendChild(colorTextBInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorTextOpacityExplain.id, vn.consts.CLASS_NAMES.colorTextOpacityExplain.className, i, {"isIcon":false, "text":"Opacity"});	//COMMENT
        colorTextSelectBox.appendChild(tempElement1);
        colorTextOpacityInput = createElementInput(colorTextOpacityInput, vn.consts.CLASS_NAMES.colorTextOpacityInput.id, vn.consts.CLASS_NAMES.colorTextOpacityInput.className, i);
        colorTextOpacityInput.setAttribute("type","number");
        colorTextOpacityInput.setAttribute("maxlength", "3");
        addClickEvent(colorTextOpacityInput, vn.consts.CLASS_NAMES.colorTextOpacityInput.id);
        colorTextSelectBox.appendChild(colorTextOpacityInput);
        tempElement1 = document.createElement("br");
        colorTextSelectBox.appendChild(tempElement1);
        colorText0 = createElementBasic(colorText0, "div", vn.consts.CLASS_NAMES.colorText0.id, vn.consts.CLASS_NAMES.colorText0.className, i);
        colorText0.style.backgroundColor = vn.colors.color12[i];
        colorTextSelectBox.appendChild(colorText0);
        colorText1 = createElementBasic(colorText1, "div", vn.consts.CLASS_NAMES.colorText1.id, vn.consts.CLASS_NAMES.colorText1.className, i);
        colorText1.style.backgroundColor = vn.colors.color14[i];
        colorTextSelectBox.appendChild(colorText1);
        colorText2 = createElementBasic(colorText2, "div", vn.consts.CLASS_NAMES.colorText2.id, vn.consts.CLASS_NAMES.colorText2.className, i);
        colorText2.style.backgroundColor = vn.colors.color15[i];
        colorTextSelectBox.appendChild(colorText2);
        colorText3 = createElementBasic(colorText3, "div", vn.consts.CLASS_NAMES.colorText3.id, vn.consts.CLASS_NAMES.colorText3.className, i);
        colorText3.style.backgroundColor = vn.colors.color16[i];
        colorTextSelectBox.appendChild(colorText3);
        colorText4 = createElementBasic(colorText4, "div", vn.consts.CLASS_NAMES.colorText4.id, vn.consts.CLASS_NAMES.colorText4.className, i);
        colorText4.style.backgroundColor = vn.colors.color17[i];
        colorTextSelectBox.appendChild(colorText4);
        colorText5 = createElementBasic(colorText5, "div", vn.consts.CLASS_NAMES.colorText5.id, vn.consts.CLASS_NAMES.colorText5.className, i);
        colorText5.style.backgroundColor = vn.colors.color18[i];
        colorTextSelectBox.appendChild(colorText5);
        colorText6 = createElementBasic(colorText6, "div", vn.consts.CLASS_NAMES.colorText6.id, vn.consts.CLASS_NAMES.colorText6.className, i);
        colorText6.style.backgroundColor = vn.colors.color19[i];
        colorTextSelectBox.appendChild(colorText6);
        colorText7 = createElementBasic(colorText7, "div", vn.consts.CLASS_NAMES.colorText7.id, vn.consts.CLASS_NAMES.colorText7.className, i);
        colorText7.style.backgroundColor = vn.colors.color20[i];
        colorTextSelectBox.appendChild(colorText7);
        //==================================================================================
        //color background select
        colorBackSelect = createElementSelect(colorBackSelect, "span", vn.consts.CLASS_NAMES.colorBackSelect.id, vn.consts.CLASS_NAMES.colorBackSelect.className, i, {"isIcon":true, "text":"format_color_fill", "iconStyle" : "font-size: 1.1em; -webkit-text-stroke: 0.5px " + vn.colors.color1[i]+";"});
        colorBackSelect.setAttribute("title",vn.languageSet[vn.variables.languages[i]].colorBackTooltip);	//COMMENT
        colorBackSelectBox = createElementSelectBox(colorBackSelectBox, "div", vn.consts.CLASS_NAMES.colorBackSelectBox.id, vn.consts.CLASS_NAMES.colorBackSelectBox.className, i);
        colorBackSelect.appendChild(colorBackSelectBox);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorBackRExplain.id, vn.consts.CLASS_NAMES.colorBackRExplain.className, i, {"isIcon":false, "text":"R"});	//COMMENT
        tempElement1.style.paddingLeft = (vn.variables.sizeRates[i] * 8) + "px";
        colorBackSelectBox.appendChild(tempElement1);
        colorBackRInput = createElementInput(colorBackRInput, vn.consts.CLASS_NAMES.colorBackRInput.id, vn.consts.CLASS_NAMES.colorBackRInput.className, i);
        colorBackRInput.setAttribute("maxlength", "2");
        addClickEvent(colorBackRInput, vn.consts.CLASS_NAMES.colorBackRInput.id);
        colorBackSelectBox.appendChild(colorBackRInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorBackGExplain.id, vn.consts.CLASS_NAMES.colorBackGExplain.className, i, {"isIcon":false, "text":"G"});	//COMMENT
        colorBackSelectBox.appendChild(tempElement1);
        colorBackGInput = createElementInput(colorBackGInput, vn.consts.CLASS_NAMES.colorBackGInput.id, vn.consts.CLASS_NAMES.colorBackGInput.className, i);
        colorBackGInput.setAttribute("maxlength", "2");
        addClickEvent(colorBackGInput, vn.consts.CLASS_NAMES.colorBackGInput.id);
        colorBackSelectBox.appendChild(colorBackGInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorBackBExplain.id, vn.consts.CLASS_NAMES.colorBackBExplain.className, i, {"isIcon":false, "text":"B"});	//COMMENT
        colorBackSelectBox.appendChild(tempElement1);
        colorBackBInput = createElementInput(colorBackBInput, vn.consts.CLASS_NAMES.colorBackBInput.id, vn.consts.CLASS_NAMES.colorBackBInput.className, i);
        colorBackBInput.setAttribute("maxlength", "2");
        addClickEvent(colorBackBInput, vn.consts.CLASS_NAMES.colorBackBInput.id);
        colorBackSelectBox.appendChild(colorBackBInput);
        tempElement1 = createElement(tempElement1, "span", vn.consts.CLASS_NAMES.colorBackOpacityExplain.id, vn.consts.CLASS_NAMES.colorBackOpacityExplain.className, i, {"isIcon":false, "text":"Opacity"});	//COMMENT
        colorBackSelectBox.appendChild(tempElement1);
        colorBackOpacityInput = createElementInput(colorBackOpacityInput, vn.consts.CLASS_NAMES.colorBackOpacityInput.id, vn.consts.CLASS_NAMES.colorBackOpacityInput.className, i);
        colorBackOpacityInput.setAttribute("type","number");
        colorBackOpacityInput.setAttribute("maxlength", "3");
        addClickEvent(colorBackOpacityInput, vn.consts.CLASS_NAMES.colorBackOpacityInput.id);
        colorBackSelectBox.appendChild(colorBackOpacityInput);
        tempElement1 = document.createElement("br");
        colorBackSelectBox.appendChild(tempElement1);
        colorBack0 = createElementBasic(colorBack0, "div", vn.consts.CLASS_NAMES.colorBack0.id, vn.consts.CLASS_NAMES.colorBack0.className, i);
        colorBack0.style.backgroundColor = vn.colors.color13[i];
        colorBackSelectBox.appendChild(colorBack0);
        colorBack1 = createElementBasic(colorBack1, "div", vn.consts.CLASS_NAMES.colorBack1.id, vn.consts.CLASS_NAMES.colorBack1.className, i);
        colorBack1.style.backgroundColor = vn.colors.color14[i];
        colorBackSelectBox.appendChild(colorBack1);
        colorBack2 = createElementBasic(colorBack2, "div", vn.consts.CLASS_NAMES.colorBack2.id, vn.consts.CLASS_NAMES.colorBack2.className, i);
        colorBack2.style.backgroundColor = vn.colors.color15[i];
        colorBackSelectBox.appendChild(colorBack2);
        colorBack3 = createElementBasic(colorBack3, "div", vn.consts.CLASS_NAMES.colorBack3.id, vn.consts.CLASS_NAMES.colorBack3.className, i);
        colorBack3.style.backgroundColor = vn.colors.color16[i];
        colorBackSelectBox.appendChild(colorBack3);
        colorBack4 = createElementBasic(colorBack4, "div", vn.consts.CLASS_NAMES.colorBack4.id, vn.consts.CLASS_NAMES.colorBack4.className, i);
        colorBack4.style.backgroundColor = vn.colors.color17[i];
        colorBackSelectBox.appendChild(colorBack4);
        colorBack5 = createElementBasic(colorBack5, "div", vn.consts.CLASS_NAMES.colorBack5.id, vn.consts.CLASS_NAMES.colorBack5.className, i);
        colorBack5.style.backgroundColor = vn.colors.color18[i];
        colorBackSelectBox.appendChild(colorBack5);
        colorBack6 = createElementBasic(colorBack6, "div", vn.consts.CLASS_NAMES.colorBack6.id, vn.consts.CLASS_NAMES.colorBack6.className, i);
        colorBack6.style.backgroundColor = vn.colors.color19[i];
        colorBackSelectBox.appendChild(colorBack6);
        colorBack7 = createElementBasic(colorBack7, "div", vn.consts.CLASS_NAMES.colorBack7.id, vn.consts.CLASS_NAMES.colorBack7.className, i);
        colorBack7.style.backgroundColor = vn.colors.color20[i];
        colorBackSelectBox.appendChild(colorBack7);
        //==================================================================================
        //formatClearButton
        //==================================================================================
        formatClearButton = createElementButton(formatClearButton, "span", vn.consts.CLASS_NAMES.formatClearButton.id, vn.consts.CLASS_NAMES.formatClearButton.className, i, {"isIcon":true, "text":"format_clear"});
        formatClearButton.setAttribute("title",vn.languageSet[vn.variables.languages[i]].formatClearButtonTooltip);	//COMMENT
        //==================================================================================
        //undo
        //==================================================================================
        undoButton = createElementButton(undoButton, "span", vn.consts.CLASS_NAMES.undoButton.id, vn.consts.CLASS_NAMES.undoButton.className, i, {"isIcon":true, "text":"undo"});
        undoButton.setAttribute("title",vn.languageSet[vn.variables.languages[i]].undoTooltip);	//COMMENT
        //==================================================================================
        //redo
        //==================================================================================
        redoButton = createElementButton(redoButton, "span", vn.consts.CLASS_NAMES.redoButton.id, vn.consts.CLASS_NAMES.redoButton.className, i, {"isIcon":true, "text":"redo"});
        redoButton.setAttribute("title",vn.languageSet[vn.variables.languages[i]].redoTooltip);	//COMMENT
        //==================================================================================
        //help
        //==================================================================================
        helpButton = createElementButton(helpButton, "span", vn.consts.CLASS_NAMES.helpButton.id, vn.consts.CLASS_NAMES.helpButton.className, i, {"isIcon":true, "text":"help"});
        helpButton.setAttribute("title",vn.languageSet[vn.variables.languages[i]].helpTooltip);	//COMMENT
        //==================================================================================
        //modal
        //==================================================================================
        modalBack = createElementBasic(modalBack, "div", vn.consts.CLASS_NAMES.modalBack.id, vn.consts.CLASS_NAMES.modalBack.className, i);
        //==================================================================================
        //modal att link
        attLinkModal = createElementBasic(attLinkModal, "div", vn.consts.CLASS_NAMES.attLinkModal.id, vn.consts.CLASS_NAMES.attLinkModal.className, i);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attLinkHeader.id, vn.consts.CLASS_NAMES.attLinkHeader.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attLinkModalTitle});	//COMMENT
        attLinkModal.appendChild(tempElement1);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attLinkExplain1.id, vn.consts.CLASS_NAMES.attLinkExplain1.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attLinkInTextExplain});	//COMMENT
        attLinkModal.appendChild(tempElement1);
        
        attLinkText = createElementInput(attLinkText, vn.consts.CLASS_NAMES.attLinkText.id, vn.consts.CLASS_NAMES.attLinkText.className, i);
        attLinkText.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attLinkInTextTooltip);	//COMMENT
        attLinkModal.appendChild(attLinkText);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attLinkExplain2.id, vn.consts.CLASS_NAMES.attLinkExplain2.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attLinkInLinkExplain});	//COMMENT
        attLinkModal.appendChild(tempElement1);
        
        attLinkHref = createElementInput(attLinkHref, vn.consts.CLASS_NAMES.attLinkHref.id, vn.consts.CLASS_NAMES.attLinkHref.className, i);
        attLinkHref.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attLinkInLinkTooltip);	//COMMENT
        attLinkModal.appendChild(attLinkHref);
        
        attLinkIsBlankCheckbox = createElementInputCheckbox(attLinkIsBlankCheckbox, vn.consts.CLASS_NAMES.attLinkIsBlankCheckbox.id, vn.consts.CLASS_NAMES.attLinkIsBlankCheckbox.className, i);
        attLinkIsBlankCheckbox.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attLinkIsOpenTooltip);	//COMMENT
        tempElement1 = createElement(tempElement1, "label", vn.consts.CLASS_NAMES.attLinkIsBlankLabel.id, vn.consts.CLASS_NAMES.attLinkIsBlankLabel.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attLinkIsOpenExplain});
        tempElement1.insertBefore(attLinkIsBlankCheckbox, tempElement1.firstChild);
        attLinkModal.appendChild(tempElement1);
        
        attLinkValidCheckText = createElement(attLinkValidCheckText, "span", vn.consts.CLASS_NAMES.attLinkValidCheckText.id, vn.consts.CLASS_NAMES.attLinkValidCheckText.className, i);
        attLinkValidCheckbox = createElementInputCheckbox(attLinkIsBlankCheckbox, vn.consts.CLASS_NAMES.attLinkValidCheckbox.id, vn.consts.CLASS_NAMES.attLinkValidCheckbox.className, i);
        attLinkValidCheckbox.style.display = "none";
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attLinkFooter.id, vn.consts.CLASS_NAMES.attLinkFooter.className, i);
        attLinkInsertButton = createElementButton(attLinkInsertButton, "button", vn.consts.CLASS_NAMES.attLinkInsertButton.id, vn.consts.CLASS_NAMES.attLinkInsertButton.className, i, {"isIcon":true, "text":"add_link"});
        tempElement1.appendChild(attLinkValidCheckText);
        tempElement1.appendChild(attLinkValidCheckbox);
        tempElement1.appendChild(attLinkInsertButton);
        
        attLinkModal.appendChild(tempElement1);
        //==================================================================================
        //modal att file
        attFileModal = createElementBasic(attFileModal, "div", vn.consts.CLASS_NAMES.attFileModal.id, vn.consts.CLASS_NAMES.attFileModal.className, i);
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attFileHeader.id, vn.consts.CLASS_NAMES.attFileHeader.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attFileModalTitle});	//COMMENT
        attFileModal.appendChild(tempElement1);
        
        //layout : upload file
        attFilelayout = createElement(attFilelayout, "div", vn.consts.CLASS_NAMES.attFilelayout.id, vn.consts.CLASS_NAMES.attFilelayout.className, i);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attFileExplain1.id, vn.consts.CLASS_NAMES.attFileExplain1.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attFileExplain1});	//COMMENT
        attFilelayout.appendChild(tempElement1);
        tempElement1 = document.createElement("br");
        attFilelayout.appendChild(tempElement1);
        
        tempElement1 = document.createElement("div");
        tempElement1.setAttribute("style","width:90%;text-align:center;margin:0 auto;");
        attFileUploadDiv = createElementButton(attFileUploadDiv, "div", vn.consts.CLASS_NAMES.attFileUploadDiv.id, vn.consts.CLASS_NAMES.attFileUploadDiv.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attFileUploadDiv});
        attFileUploadDiv.addEventListener("dragover", function(event: any) {
            consoleLog("vn.elementEvents." + "attFileUploadDiv_onBeforeDragover", "params :" , "(event)", event, "(target)", event.target);
            if(!vn.elementEvents.attFileUploadDiv_onBeforeDragover(event)) return;
            
            consoleLog("attFileUploadDiv_onDragover", "params :" , "(event)", event, "(target)", event.target);
            elementsEvent["attFileUploadDiv_onDragover"](event);
            
            consoleLog("vn.elementEvents." + "attFileUploadDiv_onAfterDragover", "params :" , "(event)", event, "(target)", event.target);
            vn.elementEvents.attFileUploadDiv_onAfterDragover(event);
            event.stopImmediatePropagation();
        });
        attFileUploadDiv.addEventListener("drop", function(event: any) {
            consoleLog("vn.elementEvents." + "attFileUploadDiv_onBeforeDrop", "params :" , "(event)", event, "(target)", event.target);
            if(!vn.elementEvents.attFileUploadDiv_onBeforeDrop(event)) return;
            
            consoleLog("attFileUploadDiv_onDrop", "params :" , "(event)", event, "(target)", event.target);
            elementsEvent["attFileUploadDiv_onDrop"](event);
            
            consoleLog("vn.elementEvents." + "attFileUploadDiv_onAfterDrop", "params :" , "(event)", event, "(target)", event.target);
            vn.elementEvents.attFileUploadDiv_onAfterDrop(event);
            event.stopImmediatePropagation();
        });
        tempElement1.appendChild(attFileUploadDiv);
        attFilelayout.appendChild(tempElement1);
        
        tempElement1 = document.createElement("div");
        tempElement1.setAttribute("style","width:90%;text-align:right;margin:5px auto 20px auto;");
        attFileUploadButton = createElementButton(attFileUploadButton, "button", vn.consts.CLASS_NAMES.attFileUploadButton.id, vn.consts.CLASS_NAMES.attFileUploadButton.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attFileUploadButton});
        tempElement1.appendChild(attFileUploadButton);
        attFilelayout.appendChild(tempElement1);

        attFileUpload = createElementInput(attFileUpload, vn.consts.CLASS_NAMES.attFileUpload.id, vn.consts.CLASS_NAMES.attFileUpload.className, i);
        attFileUpload.setAttribute("type","file");
        attFileUpload.setAttribute("multiple","");
        attFilelayout.appendChild(tempElement1);
        attFilelayout.appendChild(attFileUpload);
        attFileModal.appendChild(attFilelayout);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attFileFooter.id, vn.consts.CLASS_NAMES.attFileFooter.className, i);
        attFileInsertButton = createElementButton(attFileInsertButton, "button", vn.consts.CLASS_NAMES.attFileInsertButton.id, vn.consts.CLASS_NAMES.attFileInsertButton.className, i, {"isIcon":true, "text":"attach_file"});
        tempElement1.appendChild(attFileInsertButton);
        attFileModal.appendChild(tempElement1);
        //==================================================================================
        //modal att image
        attImageModal = createElementBasic(attImageModal, "div", vn.consts.CLASS_NAMES.attImageModal.id, vn.consts.CLASS_NAMES.attImageModal.className, i);
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attImageHeader.id, vn.consts.CLASS_NAMES.attImageHeader.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attImageModalTitle});	//COMMENT
        attImageModal.appendChild(tempElement1);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attImageExplain1.id, vn.consts.CLASS_NAMES.attImageExplain1.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attImageExplain1});	//COMMENT
        attImageModal.appendChild(tempElement1);
        tempElement1 = document.createElement("br");
        attImageModal.appendChild(tempElement1);
        
        tempElement1 = document.createElement("div");
        tempElement1.setAttribute("style","width:90%;text-align:center;margin:0 auto;position:relative;");
        attImageViewPreButtion = createElementButton(attImageInsertButton, "button", vn.consts.CLASS_NAMES.attImageViewPreButtion.id, vn.consts.CLASS_NAMES.attImageViewPreButtion.className, i, {"isIcon":true, "text":"navigate_before"});
        attImageViewPreButtion.setAttribute("style","position:absolute;top:50%;transform:translateY(-50%) translateX(1%);");
        tempElement1.appendChild(attImageViewPreButtion);
        
        attImageUploadButtonAndView = createElementBasic(attImageUploadButtonAndView, "div", vn.consts.CLASS_NAMES.attImageUploadButtonAndView.id, vn.consts.CLASS_NAMES.attImageUploadButtonAndView.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attImageUploadButtonAndView});
        attImageUploadButtonAndView.addEventListener("dragover", function(event: any) {
            consoleLog("vn.elementEvents." + "attImageUploadButtonAndView_onBeforeDragover", "params :" , "(event)", event, "(target)", event.target);
            if(!vn.elementEvents.attImageUploadButtonAndView_onBeforeDragover(event)) return;
            
            consoleLog("attImageUploadButtonAndView_onDragover", "params :" , "(event)", event, "(target)", event.target);
            elementsEvent["attImageUploadButtonAndView_onDragover"](event);
            
            consoleLog("vn.elementEvents." + "attImageUploadButtonAndView_onAfterDragover", "params :" , "(event)", event, "(target)", event.target);
            vn.elementEvents.attImageUploadButtonAndView_onAfterDragover(event);
            event.stopImmediatePropagation();
        });
        attImageUploadButtonAndView.addEventListener("drop", function(event: any) {
            consoleLog("vn.elementEvents." + "attImageUploadButtonAndView_onBeforeDrop", "params :" , "(event)", event, "(target)", event.target);
            if(!vn.elementEvents.attImageUploadButtonAndView_onBeforeDrop(event)) return;
            
            consoleLog("attImageUploadButtonAndView_onDrop", "params :" , "(event)", event, "(target)", event.target);
            elementsEvent["attImageUploadButtonAndView_onDrop"](event);
            
            consoleLog("vn.elementEvents." + "attImageUploadButtonAndView_onAfterDrop", "params :" , "(event)", event, "(target)", event.target);
            vn.elementEvents.attImageUploadButtonAndView_onAfterDrop(event);
            event.stopImmediatePropagation();
        });
        tempElement1.appendChild(attImageUploadButtonAndView);
        
        attImageViewNextButtion = createElementButton(attImageInsertButton, "button", vn.consts.CLASS_NAMES.attImageViewNextButtion.id, vn.consts.CLASS_NAMES.attImageViewNextButtion.className, i, {"isIcon":true, "text":"navigate_next"});
        attImageViewNextButtion.setAttribute("style","position:absolute;top:50%;transform:translateY(-50%) translateX(-101%);");
        tempElement1.appendChild(attImageViewNextButtion);
        
        attImageModal.appendChild(tempElement1);
        
        attImageUpload = createElementInput(attImageUpload, vn.consts.CLASS_NAMES.attImageUpload.id, vn.consts.CLASS_NAMES.attImageUpload.className, i);
        attImageUpload.setAttribute("type","file");
        attImageUpload.setAttribute("multiple","");
        attImageAcceptTypes = getCommaStrFromArr(vn.variables.attImageAcceptTypes[i])
        attImageUpload.setAttribute("accept",attImageAcceptTypes);	    
        attImageModal.appendChild(attImageUpload);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attImageExplain2.id, vn.consts.CLASS_NAMES.attImageExplain2.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attImageExplain2});	//COMMENT
        attImageModal.appendChild(tempElement1);
        tempElement1 = document.createElement("br");
        attImageModal.appendChild(tempElement1);
        
        attImageURL = createElementInput(attLinkHref, vn.consts.CLASS_NAMES.attImageURL.id, vn.consts.CLASS_NAMES.attImageURL.className, i);
        attImageURL.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attImageURLTooltip);	//COMMENT
        attImageModal.appendChild(attImageURL);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attImageFooter.id, vn.consts.CLASS_NAMES.attImageFooter.className, i);
        attImageInsertButton = createElementButton(attImageInsertButton, "button", vn.consts.CLASS_NAMES.attImageInsertButton.id, vn.consts.CLASS_NAMES.attImageInsertButton.className, i, {"isIcon":true, "text":"image"});
        tempElement1.appendChild(attImageInsertButton);
        attImageModal.appendChild(tempElement1);
        //==================================================================================
        //modal att video
        attVideoModal = createElementBasic(attVideoModal, "div", vn.consts.CLASS_NAMES.attVideoModal.id, vn.consts.CLASS_NAMES.attVideoModal.className, i);
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attVideoHeader.id, vn.consts.CLASS_NAMES.attVideoHeader.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attVideoModalTitle});	//COMMENT
        attVideoModal.appendChild(tempElement1);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attVideoExplain1.id, vn.consts.CLASS_NAMES.attVideoExplain1.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attVideoExplain1});	//COMMENT
        attVideoModal.appendChild(tempElement1);

        attVideoEmbedId = createElementInput(attVideoEmbedId, vn.consts.CLASS_NAMES.attVideoEmbedId.id, vn.consts.CLASS_NAMES.attVideoEmbedId.className, i);
        attVideoEmbedId.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attVideoEmbedIdTooltip);	//COMMENT
        attVideoModal.appendChild(attVideoEmbedId);

        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attVideoExplain2.id, vn.consts.CLASS_NAMES.attVideoExplain2.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].attVideoExplain2});	//COMMENT
        attVideoModal.appendChild(tempElement1);

        tempElement1 = document.createElement("div");
        tempElement1.setAttribute("style","padding-left:20px;color:" + vn.colors.color10[i]);
        tempElement2 = createElement(tempElement2, "span", "", "modal_att_video_icon", i, {"isIcon":true, "text":"width", "iconStyle":"color:" + vn.colors.color10[i]});
        tempElement1.appendChild(tempElement2);
        attVideoWidth  = createElementInput(attVideoWidth, vn.consts.CLASS_NAMES.attVideoWidth.id, vn.consts.CLASS_NAMES.attVideoWidth.className, i);
        attVideoWidth.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attVideoWidthTooltip);	//COMMENT
        attVideoWidth.setAttribute("type", "number");
        attVideoWidth.setAttribute("style","text-align:right;");
        tempElement1.appendChild(attVideoWidth);
        tempElement2 = createElement(tempElement2, "span", "", "modal_att_video_icon", i, {"isIcon":false, "text":"%"});
        tempElement2.setAttribute("style","padding-left:10px;font-size:0.8em");
        tempElement1.appendChild(tempElement2);
        attVideoModal.appendChild(tempElement1);

        tempElement1 = document.createElement("div");
        tempElement1.setAttribute("style","padding-left:20px;color:" + vn.colors.color10[i]);
        tempElement2 = createElement(tempElement2, "span", "", "modal_att_video_icon", i, {"isIcon":true, "text":"height", "iconStyle":"color:" + vn.colors.color10[i]});
        tempElement1.appendChild(tempElement2);
        attVideoHeight = createElementInput(attVideoHeight, vn.consts.CLASS_NAMES.attVideoHeight.id, vn.consts.CLASS_NAMES.attVideoHeight.className, i);
        attVideoHeight.setAttribute("title",vn.languageSet[vn.variables.languages[i]].attVideoHeightTooltip);	//COMMENT
        attVideoHeight.setAttribute("type", "number");
        attVideoHeight.setAttribute("style","text-align:right;");
        tempElement1.appendChild(attVideoHeight);
        tempElement2 = createElement(tempElement2, "span", "", "modal_att_video_icon", i, {"isIcon":false, "text":"px"});
        tempElement2.setAttribute("style","padding-left:10px;font-size:0.8em");
        tempElement1.appendChild(tempElement2);
        attVideoModal.appendChild(tempElement1);

        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attVideoFooter.id, vn.consts.CLASS_NAMES.attVideoFooter.className, i);

        attVideoValidCheckText = createElement(attVideoValidCheckText, "span", vn.consts.CLASS_NAMES.attVideoValidCheckText.id, vn.consts.CLASS_NAMES.attVideoValidCheckText.className, i);
        attVideoValidCheckbox = createElementInputCheckbox(attVideoValidCheckbox, vn.consts.CLASS_NAMES.attVideoValidCheckbox.id, vn.consts.CLASS_NAMES.attVideoValidCheckbox.className, i);
        attVideoValidCheckbox.style.display = "none";
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.attVideoFooter.id, vn.consts.CLASS_NAMES.attVideoFooter.className, i);
        attVideoInsertButton = createElementButton(attVideoInsertButton, "button", vn.consts.CLASS_NAMES.attVideoInsertButton.id, vn.consts.CLASS_NAMES.attVideoInsertButton.className, i, {"isIcon":true, "text":"videocam"});
        tempElement1.appendChild(attVideoValidCheckText);
        tempElement1.appendChild(attVideoValidCheckbox);
        tempElement1.appendChild(attVideoInsertButton);
        attVideoModal.appendChild(tempElement1);
        //==================================================================================
        //att link tooltip
        attLinkTooltip = createElement(attLinkTooltip, "div", vn.consts.CLASS_NAMES.attLinkTooltip.id, vn.consts.CLASS_NAMES.attLinkTooltip.className, i);
        attLinkTooltipHref = createElement(attLinkTooltipHref, "a", vn.consts.CLASS_NAMES.attLinkTooltipHref.id, vn.consts.CLASS_NAMES.attLinkTooltipHref.className, i);
        attLinkTooltipHref.setAttribute("target","_blank");
        attLinkTooltipEditButton = createElementButton(attLinkTooltipEditButton, "span", vn.consts.CLASS_NAMES.attLinkTooltipEditButton.id, vn.consts.CLASS_NAMES.attLinkTooltipEditButton.className, i, {"isIcon":true, "text":"add_link", "iconStyle":"font-size:0.9em"});
        attLinkTooltipUnlinkButton = createElementButton(attLinkTooltipUnlinkButton, "span", vn.consts.CLASS_NAMES.attLinkTooltipUnlinkButton.id, vn.consts.CLASS_NAMES.attLinkTooltipUnlinkButton.className, i, {"isIcon":true, "text":"link_off", "iconStyle":"font-size:0.9em"});
        
        attLinkTooltip.appendChild(attLinkTooltipEditButton);
        attLinkTooltip.appendChild(attLinkTooltipUnlinkButton);
        attLinkTooltip.appendChild(attLinkTooltipHref);
        
        //==================================================================================
        //att image tooltip
        attImageAndVideoTooltip = createElement(attImageAndVideoTooltip, "div", vn.consts.CLASS_NAMES.attImageAndVideoTooltip.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltip.className, i);
        
        tempElement1 = document.createElement("div");
        
        tempElement2 = document.createElement("span");
        tempElement2.setAttribute("class",getClassName(i, "small_text_box"));
        tempElement2.setAttribute("style","padding: 0 0 0 10px;");
        tempElement2.textContent = vn.languageSet[vn.variables.languages[i]].attImageAndVideoTooltipWidthInput;	//COMMENT
        tempElement1.appendChild(tempElement2);
        
        attImageAndVideoTooltipWidthInput = createElementInput(attImageAndVideoTooltipWidthInput, vn.consts.CLASS_NAMES.attImageAndVideoTooltipWidthInput.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipWidthInput.className, i);
        attImageAndVideoTooltipWidthInput.addEventListener("keyup", function(event: any) {
            consoleLog("vn.elementEvents." + "attImageAndVideoTooltipWidthInput_onBeforeKeyup", "params :" , "(event)", event, "(target)", event.target);
            if(!vn.elementEvents.attImageAndVideoTooltipWidthInput_onBeforeKeyup(event)) return;
            
            consoleLog("attImageAndVideoTooltipWidthInput_onKeyup", "params :" , "(event)", event, "(target)", event.target);
            elementsEvent["attImageAndVideoTooltipWidthInput_onKeyup"](event);
            
            consoleLog("vn.elementEvents." + "attImageAndVideoTooltipWidthInput_onAfterKeyup", "params :" , "(event)", event, "(target)", event.target);
            vn.elementEvents.attImageAndVideoTooltipWidthInput_onAfterKeyup(event);
            event.stopImmediatePropagation();
        });
        attImageAndVideoTooltipWidthInput.setAttribute("type","number");
        tempElement1.appendChild(attImageAndVideoTooltipWidthInput);
        
        tempElement2 = document.createElement("span");
        tempElement2.setAttribute("class",getClassName(i, "small_text_box"));
        tempElement2.setAttribute("style","padding: 0;");
        tempElement2.textContent = "%";
        tempElement1.appendChild(tempElement2);
        
        tempElement2 = document.createElement("span");
        tempElement2.setAttribute("class",getClassName(i, "small_text_box"));
        tempElement2.textContent = vn.languageSet[vn.variables.languages[i]].attImageAndVideoTooltipFloatRadio;	//COMMENT
        tempElement1.appendChild(tempElement2);
        
        attImageAndVideoTooltipFloatRadioNone = createElementInputRadio(
                                                attImageAndVideoTooltipFloatRadioNone,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.id,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.className,
                                                getId(i, "attImageAndVideoTooltipFloatRadio"),
                                                i
                                            );
        tempElement1.appendChild(attImageAndVideoTooltipFloatRadioNone);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.id), "close");
        tempElement1.appendChild(tempElement2);
        attImageAndVideoTooltipFloatRadioLeft = createElementInputRadio(
                                                attImageAndVideoTooltipFloatRadioLeft,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.id,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.className,
                                                getId(i, "attImageAndVideoTooltipFloatRadio"),
                                                i
                                            );
        tempElement1.appendChild(attImageAndVideoTooltipFloatRadioLeft);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.id), "art_track");
        tempElement1.appendChild(tempElement2);
        attImageAndVideoTooltipFloatRadioRight = createElementInputRadio(
                                                attImageAndVideoTooltipFloatRadioRight,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.id,
                                                vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.className,
                                                getId(i, "attImageAndVideoTooltipFloatRadio"),
                                                i
                                            );
        tempElement1.appendChild(attImageAndVideoTooltipFloatRadioRight);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.id), "burst_mode");
        tempElement1.appendChild(tempElement2);
        attImageAndVideoTooltip.appendChild(tempElement1);
        
        tempElement1 = document.createElement("div");
        
        tempElement2 = document.createElement("span");
        tempElement2.setAttribute("class",getClassName(i, "small_text_box"));
        tempElement2.textContent = vn.languageSet[vn.variables.languages[i]].attImageAndVideoTooltipShapeRadio;	//COMMENT
        tempElement1.appendChild(tempElement2);
        
        attImageAndVideoTooltipShapeRadioSquare = createElementInputRadio(
                                                    attImageAndVideoTooltipShapeRadioSquare,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.id,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.className,
                                                    getId(i, "attImageAndVideoTooltipShapeRadio"),
                                                    i
                                                );
        tempElement1.appendChild(attImageAndVideoTooltipShapeRadioSquare);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.id), "crop_5_4");
        tempElement1.appendChild(tempElement2);
        attImageAndVideoTooltipShapeRadioRadius = createElementInputRadio(
                                                    attImageAndVideoTooltipShapeRadioRadius,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.id,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.className,
                                                    getId(i, "attImageAndVideoTooltipShapeRadio"),
                                                    i
                                                );
        tempElement1.appendChild(attImageAndVideoTooltipShapeRadioRadius);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.id), "aspect_ratio");
        tempElement1.appendChild(tempElement2);
        attImageAndVideoTooltipShapeRadioCircle = createElementInputRadio(
                                                    attImageAndVideoTooltipShapeRadioCircle,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.id,
                                                    vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.className,
                                                    getId(i, "attImageAndVideoTooltipShapeRadio"),
                                                    i
                                                );
        tempElement1.appendChild(attImageAndVideoTooltipShapeRadioCircle);
        tempElement2 = createElementRadioLabel(getId(i, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.id), "circle");
        tempElement1.appendChild(tempElement2);
        
        attImageAndVideoTooltip.appendChild(tempElement1);
        
        //==================================================================================
        //modal help
        helpModal = createElementBasic(helpModal, "div", vn.consts.CLASS_NAMES.helpModal.id, vn.consts.CLASS_NAMES.helpModal.className, i);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.helpHeader.id, vn.consts.CLASS_NAMES.helpHeader.className, i, {"isIcon":false, "text":vn.languageSet[vn.variables.languages[i]].helpModalTitle});	//COMMENT
        helpModal.appendChild(tempElement1);
        
        helpMain = createElement(helpMain, "div", vn.consts.CLASS_NAMES.helpMain.id, vn.consts.CLASS_NAMES.helpMain.className, i);
        tempElement1 = document.createElement("table");
        var tempKeys;
        for(var j = 0; j < vn.languageSet[vn.variables.languages[i]].helpContent.length; j++) {
            tempElement2 = document.createElement("tr");
            tempKeys = Object.keys(vn.languageSet[vn.variables.languages[i]].helpContent[j]);
            for(var k = 0; k < tempKeys.length; k++) {
                tempElement3 = document.createElement("td");
                tempElement3.textContent = tempKeys[k];
                tempElement3.setAttribute("style","width:30%;padding:0 0 6px 12px;border:none;");
                tempElement2.appendChild(tempElement3);
                tempElement3 = document.createElement("td");
                tempElement3.setAttribute("style","width:70%;padding:0 12px 6px 12px;border:none;");
                tempElement3.textContent = vn.languageSet[vn.variables.languages[i]].helpContent[j][tempKeys[k]];
                tempElement2.appendChild(tempElement3);
            }
            tempElement1.appendChild(tempElement2);
        }
        helpMain.appendChild(tempElement1);
        helpModal.appendChild(helpMain);
        
        tempElement1 = createElement(tempElement1, "div", vn.consts.CLASS_NAMES.helpFooter.id, vn.consts.CLASS_NAMES.helpFooter.className, i);
        tempElement1.setAttribute("style","height:25px;");
        helpModal.appendChild(tempElement1);
        
        //==================================================================================
        //placeholder
        //==================================================================================
        if(!vn.elements.placeholders[i]) {
            placeholder = createElementBasic(placeholder, "div", vn.consts.CLASS_NAMES.placeholder.id, vn.consts.CLASS_NAMES.placeholder.className, i);
            
            if(placeholderTitle) {
                tempElement1 = document.createElement("h5");
                tempElement1.innerText = placeholderTitle;
                placeholder.appendChild(tempElement1);
            }
            if(placeholderTextContent) {
                tempElement1 = document.createElement("p");
                tempElement1.innerText = placeholderTextContent;
                placeholder.appendChild(tempElement1);
            }
            
            vn.elements.placeholders[i] = placeholder;
        }
        else {
            placeholder = vn.elements.placeholders[i];
        }
        
        //==================================================================================
        //append child
        //==================================================================================
        modalBack.appendChild(attLinkModal);
        modalBack.appendChild(attFileModal);
        modalBack.appendChild(attImageModal);
        modalBack.appendChild(attVideoModal);
        modalBack.appendChild(helpModal);
        template.appendChild(modalBack);
        template.appendChild(placeholder);
        if(vn.variables.toolToggles[i]) {
            tool.appendChild(toolToggleButton);
        }
        tool.appendChild(paragraphStyleSelect);
        tool.appendChild(boldButton);
        tool.appendChild(underlineButton);
        tool.appendChild(italicButton);
        tool.appendChild(ulButton);
        tool.appendChild(olButton);
        tool.appendChild(textAlignSelect);
        tool.appendChild(attLinkButton);
        tool.appendChild(attFileButton);
        tool.appendChild(attImageButton);
        tool.appendChild(attVideoButton);
        tool.appendChild(fontSizeInputBox);
        tool.appendChild(letterSpacingInputBox);
        tool.appendChild(lineHeightInputBox);
        tool.appendChild(fontFamilySelect);
        tool.appendChild(colorTextSelect);
        tool.appendChild(colorBackSelect);
        tool.appendChild(formatClearButton);
        tool.appendChild(undoButton);
        tool.appendChild(redoButton);
        tool.appendChild(helpButton);
        if(vn.variables.toolPositions[i] === "BOTTOM") {
            template.appendChild(textarea);
            template.appendChild(attLinkTooltip);
            template.appendChild(attImageAndVideoTooltip);
            template.appendChild(tool);
        }
        else {
            template.appendChild(tool);
            template.appendChild(attLinkTooltip);
            template.appendChild(attImageAndVideoTooltip);
            template.appendChild(textarea);
        }
        
        note.appendChild(template);
        //==================================================================================
        //push elements
        //==================================================================================
        vn.elements.templates.push(template);
        vn.elements.tools.push(tool);
        vn.elements.textareas.push(textarea);
        vn.elements.paragraphStyleSelects.push(paragraphStyleSelect);
        vn.elements.toolToggleButtons.push(toolToggleButton);
        vn.elements.paragraphStyleSelectBoxes.push(paragraphStyleSelectBox);
        vn.elements.boldButtons.push(boldButton);
        vn.elements.underlineButtons.push(underlineButton);
        vn.elements.italicButtons.push(italicButton);
        vn.elements.ulButtons.push(ulButton);
        vn.elements.olButtons.push(olButton);
        vn.elements.textAlignSelects.push(textAlignSelect);
        vn.elements.textAlignSelectBoxes.push(textAlignSelectBox);
        vn.elements.attLinkButtons.push(attLinkButton);
        vn.elements.attFileButtons.push(attFileButton);
        vn.elements.attImageButtons.push(attImageButton);
        vn.elements.attVideoButtons.push(attVideoButton);
        vn.elements.fontFamilySelects.push(fontFamilySelect);
        vn.elements.fontFamilySelectBoxes.push(fontFamilySelectBox);
        
        vn.elements.colorTextSelects.push(colorTextSelect);
        vn.elements.colorTextSelectBoxes.push(colorTextSelectBox);
        vn.elements.colorText0s.push(colorText0);
        vn.elements.colorText1s.push(colorText1);
        vn.elements.colorText2s.push(colorText2);
        vn.elements.colorText3s.push(colorText3);
        vn.elements.colorText4s.push(colorText4);
        vn.elements.colorText5s.push(colorText5);
        vn.elements.colorText6s.push(colorText6);
        vn.elements.colorText7s.push(colorText7);
        vn.elements.colorTextRInputs.push(colorTextRInput);
        vn.elements.colorTextGInputs.push(colorTextGInput);
        vn.elements.colorTextBInputs.push(colorTextBInput);
        vn.elements.colorTextOpacityInputs.push(colorTextOpacityInput);
        
        vn.elements.colorBackSelects.push(colorBackSelect);
        vn.elements.colorBackSelectBoxes.push(colorBackSelectBox);
        vn.elements.colorBack0s.push(colorBack0);
        vn.elements.colorBack1s.push(colorBack1);
        vn.elements.colorBack2s.push(colorBack2);
        vn.elements.colorBack3s.push(colorBack3);
        vn.elements.colorBack4s.push(colorBack4);
        vn.elements.colorBack5s.push(colorBack5);
        vn.elements.colorBack6s.push(colorBack6);
        vn.elements.colorBack7s.push(colorBack7);
        vn.elements.colorBackRInputs.push(colorBackRInput);
        vn.elements.colorBackGInputs.push(colorBackGInput);
        vn.elements.colorBackBInputs.push(colorBackBInput);
        vn.elements.colorBackOpacityInputs.push(colorBackOpacityInput);
        vn.elements.formatClearButtons.push(formatClearButton);
        vn.elements.undoButtons.push(undoButton);
        vn.elements.redoButtons.push(redoButton);
        vn.elements.helpButtons.push(helpButton);
        vn.elements.fontSizeInputBoxes.push(fontSizeInputBox);
        vn.elements.fontSizeInputs.push(fontSizeInput);
        vn.elements.letterSpacingInputBoxes.push(letterSpacingInputBox);
        vn.elements.letterSpacingInputs.push(letterSpacingInput);
        vn.elements.lineHeightInputBoxes.push(lineHeightInputBox);
        vn.elements.lineHeightInputs.push(lineHeightInput);
        vn.elements.backModals.push(modalBack);
        
        vn.elements.attLinkModals.push(attLinkModal);
        vn.elements.attLinkTexts.push(attLinkText);
        vn.elements.attLinkHrefs.push(attLinkHref);
        vn.elements.attLinkIsBlankCheckboxes.push(attLinkIsBlankCheckbox);
        vn.elements.attLinkValidCheckTexts.push(attLinkValidCheckText);
        vn.elements.attLinkValidCheckboxes.push(attLinkValidCheckbox);
        vn.elements.attLinkInsertButtons.push(attLinkInsertButton);
        vn.elements.attLinkTooltips.push(attLinkTooltip);
        vn.elements.attLinkTooltipHrefs.push(attLinkTooltipHref);
        vn.elements.attLinkTooltipEditButtons.push(attLinkTooltipEditButton);
        vn.elements.attLinkTooltipUnlinkButtons.push(attLinkTooltipUnlinkButton);
        
        vn.elements.attFileModals.push(attFileModal);
        vn.elements.attFilelayouts.push(attFilelayout);
        vn.elements.attFileUploadButtons.push(attFileUploadButton);
        vn.elements.attFileUploads.push(attFileUpload);
        vn.elements.attFileUploadDivs.push(attFileUploadDiv);
        vn.elements.attFileInsertButtons.push(attFileInsertButton);
        
        vn.elements.attImageModals.push(attImageModal);
        vn.elements.attImageUploadButtonAndViews.push(attImageUploadButtonAndView);
        vn.elements.attImageViewPreButtions.push(attImageViewPreButtion);
        vn.elements.attImageViewNextButtions.push(attImageViewNextButtion);
        vn.elements.attImageUploads.push(attImageUpload);
        vn.elements.attImageURLs.push(attImageURL);
        vn.elements.attImageInsertButtons.push(attImageInsertButton);

        vn.elements.attVideoModals.push(attVideoModal);
        vn.elements.attVideoEmbedIds.push(attVideoEmbedId);
        vn.elements.attVideoWidthes.push(attVideoWidth);
        vn.elements.attVideoHeights.push(attVideoHeight);
        vn.elements.attVideoValidCheckTexts.push(attVideoValidCheckText);
        vn.elements.attVideoValidCheckboxes.push(attVideoValidCheckbox);
        vn.elements.attVideoInsertButtons.push(attVideoInsertButton);
        
        vn.elements.attImageAndVideoTooltips.push(attImageAndVideoTooltip);
        vn.elements.attImageAndVideoTooltipWidthInputs.push(attImageAndVideoTooltipWidthInput);
        vn.elements.attImageAndVideoTooltipFloatRadioNones.push(attImageAndVideoTooltipFloatRadioNone);
        vn.elements.attImageAndVideoTooltipFloatRadioLefts.push(attImageAndVideoTooltipFloatRadioLeft);
        vn.elements.attImageAndVideoTooltipFloatRadioRights.push(attImageAndVideoTooltipFloatRadioRight);
        vn.elements.attImageAndVideoTooltipShapeRadioSquares.push(attImageAndVideoTooltipShapeRadioSquare);
        vn.elements.attImageAndVideoTooltipShapeRadioRadiuses.push(attImageAndVideoTooltipShapeRadioRadius);
        vn.elements.attImageAndVideoTooltipShapeRadioCircles.push(attImageAndVideoTooltipShapeRadioCircle);
        
        vn.elements.helpModals.push(helpModal);
        
        //==================================================================================
        //push variables
        //==================================================================================
        vn.variables.useMobileActiveMode.push(isMobileDevice());
        
        vn.variables.boldToggles.push(false);
        vn.variables.underlineToggles.push(false);
        vn.variables.italicToggles.push(false);
        vn.variables.ulToggles.push(false);
        vn.variables.olToggles.push(false);
        
        vn.variables.fontSizes.push(defaultFontSize);
        vn.variables.letterSpacings.push("0");
        vn.variables.lineHeights.push(defaultLineHeight);
        vn.variables.fontFamilies.push(defaultFontFamiliy);
        
        vn.variables.colorTextRs.push(getExtractColorValue(vn.colors.color12[i],"R"));
        vn.variables.colorTextGs.push(getExtractColorValue(vn.colors.color12[i],"G"));
        vn.variables.colorTextBs.push(getExtractColorValue(vn.colors.color12[i],"B"));
        vn.variables.colorTextOs.push("1");
        vn.variables.colorTextRGBs.push(vn.colors.color12[i]);
        vn.variables.colorTextOpacitys.push("1");
        
        vn.variables.colorBackRs.push(getExtractColorValue(vn.colors.color13[i],"R"));
        vn.variables.colorBackGs.push(getExtractColorValue(vn.colors.color13[i],"G"));
        vn.variables.colorBackBs.push(getExtractColorValue(vn.colors.color13[i],"B"));
        vn.variables.colorBackOs.push("0");
        vn.variables.colorBackRGBs.push(vn.colors.color13[i]);
        vn.variables.colorBackOpacitys.push("0");
        
        vn.variables.attTempFiles.push((new Object as any));
        vn.variables.attFiles.push((new Object as any));
        vn.variables.attTempImages.push((new Object as any));
        vn.variables.attImages.push((new Object as any));
        vn.variables.editDragUnitElements.push([]);
        //An incomprehensible error...
// 		vn.variables.recodeContings.push(0);
// 		vn.variables.recodeNotes.push([vn.elements.textareas[i].cloneNode(true)]);
        vn.variables.recodeContings.push(-1);
        vn.variables.recodeNotes.push([]);
        
        //==================================================================================
        //set input values
        //==================================================================================
        (vn.elements.fontSizeInputs[i] as any).value = defaultFontSize;
        (vn.elements.letterSpacingInputs[i] as any).value = "0";
        (vn.elements.lineHeightInputs[i] as any).value = defaultLineHeight;

        (vn.elements.colorTextRInputs[i] as any).value = vn.variables.colorTextRs[i];
        (vn.elements.colorTextGInputs[i] as any).value = vn.variables.colorTextGs[i];
        (vn.elements.colorTextBInputs[i] as any).value = vn.variables.colorTextBs[i];
        (vn.elements.colorTextOpacityInputs[i] as any).value = vn.variables.colorTextOs[i];

        (vn.elements.colorBackRInputs[i] as any).value = vn.variables.colorBackRs[i];
        (vn.elements.colorBackGInputs[i] as any).value = vn.variables.colorBackGs[i];
        (vn.elements.colorBackBInputs[i] as any).value = vn.variables.colorBackBs[i];
        (vn.elements.colorBackOpacityInputs[i] as any).value = vn.variables.colorBackOs[i];
        
        //==================================================================================
        //set no using note function
        //==================================================================================
        if(!usingParagraphStyle) vn.elements.paragraphStyleSelects[i].style.display = "none";
        if(!usingBold) vn.elements.boldButtons[i].style.display = "none";
        if(!usingUnderline) vn.elements.underlineButtons[i].style.display = "none";
        if(!usingItalic) vn.elements.italicButtons[i].style.display = "none";
        if(!usingUl) vn.elements.ulButtons[i].style.display = "none";
        if(!usingOl) vn.elements.olButtons[i].style.display = "none";
        if(!usingTextAlign) vn.elements.textAlignSelects[i].style.display = "none";
        if(!usingAttLink) vn.elements.attLinkButtons[i].style.display = "none";
        if(!usingAttFile) vn.elements.attFileButtons[i].style.display = "none";
        if(!usingAttImage) vn.elements.attImageButtons[i].style.display = "none";
        if(!usingAttVideo) vn.elements.attVideoButtons[i].style.display = "none";
        if(!usingFontSize) vn.elements.fontSizeInputBoxes[i].style.display = "none";
        if(!usingLetterSpacing) vn.elements.letterSpacingInputBoxes[i].style.display = "none";
        if(!usingLineHeight) vn.elements.lineHeightInputBoxes[i].style.display = "none";
        if(!usingFontFamily) vn.elements.fontFamilySelects[i].style.display = "none";
        if(!usingColorText) vn.elements.colorTextSelects[i].style.display = "none";
        if(!usingColorBack) vn.elements.colorBackSelects[i].style.display = "none";
        if(!usingFormatClear) vn.elements.formatClearButtons[i].style.display = "none";
        if(!usingUndo) vn.elements.undoButtons[i].style.display = "none";
        if(!usingRedo) vn.elements.redoButtons[i].style.display = "none";
        if(!usingHelp) vn.elements.helpButtons[i].style.display = "none";
    }
    
    //==================================================================================
    //Create style element//반복문 내 선언방식으로 변경
    styleElement = document.createElement("style");
    styleElement.setAttribute("id", vn.variables.noteName + "_styles-sheet");
    styleElement.type = "text/css";
    
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssText;
    }
    else {
        styleElement.appendChild(document.createTextNode(cssText));
    }
    header.appendChild(styleElement);
    
}

function destroyVanillanote(vn: Vanillanote) {
    //Only created Vanillanote works
    if(!vn.variables.isCreated) return;
    
    //styles sheet remove
    var stylesSheet = document.getElementById(vn.variables.noteName + "_styles-sheet");
    stylesSheet!.remove();
    
    //google icons link remove
    var iconsLink = document.getElementById(vn.variables.noteName + "_icons-link");
    iconsLink!.remove();
    
    //document, window evnet remove
    document.removeEventListener("selectionchange", (vn.eventStore as any).selectionchange);
    document.removeEventListener("keydown", (vn.eventStore as any).keydown);
    window.removeEventListener("resize", (vn.eventStore as any).resize);
    if(window.visualViewport) window.visualViewport.removeEventListener("resize", (vn.eventStore as any).resizeViewport);
    
    //html elements remove
    var removeAllChildNodes = function(parent: any) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    var notes = document.querySelectorAll('[data-vanillanote]');
    for(var i = 0; i < notes.length; i++) {
        removeAllChildNodes(notes[i]);
    }
    
    //object remove
    (vn as any) = null;
}

export { getVanillanote, createVanillanote, destroyVanillanote };
