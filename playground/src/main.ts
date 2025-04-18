import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { getVanillanote, getVanillanoteConfig } from 'vanillanote2';
import type { LanguagePack, Vanillanote } from 'vanillanote2';

const app = createApp(App);

// 1. Vanillanote 객체 생성
const vnConfig = getVanillanoteConfig();
const jpnLanguagePack: LanguagePack = {
    textareaTooltip : '',
    thanks : 'ありがとうございます！',
    styleTooltip : '段落スタイル',
    boldTooltip : '太字',
    underlineTooltip : '下線',
    italicTooltip : '斜体',
    ulTooltip : 'リスト',
    olTooltip : '番号付きリスト',
    textAlignTooltip : 'テキスト整列',
    attLinkTooltip : 'リンク添付',
    attFileTooltip : 'ファイル添付',
    attImageTooltip : '画像添付',
    attVideoTooltip : 'ビデオ添付',
    fontSizeTooltip : 'フォントサイズ',
    letterSpacingTooltip : '文字間隔',
    lineHeightTooltip : '行の高さ',
    fontFamilyTooltip : 'フォントファミリー',
    colorTextTooltip : 'テキストの色',
    colorBackTooltip : '背景色',
    formatClearButtonTooltip : 'エフェクトを削除',
    undoTooltip : '元に戻す',
    redoTooltip : 'やり直し',	
    helpTooltip : 'ヘルプ',
    attLinkModalTitle : 'リンク挿入',
    attLinkInTextExplain : '表示するテキストを入力してください。',
    attLinkInLinkExplain : '遷移するリンクを入力してください。',
    attLinkIsOpenExplain : ' 新しいウィンドウで開きますか？',
    attLinkInTextTooltip : 'テキストを入力してください。',
    attLinkInLinkTooltip : 'リンクを入力してください。',
    attLinkIsOpenTooltip : 'クリックすると新しいウィンドウで開きます。',
    attFileModalTitle : 'ファイル挿入',
    attFileExplain1 : 'ファイルをアップロードしてください。',
    attFileUploadButton : 'ファイル選択',
    attFileUploadDiv : 'ファイルをドロップしてください。',
    attFileListTooltip : '削除',
    attImageModalTitle : '画像挿入',
    attImageUploadButtonAndView : '画像の選択',
    attImageExplain1 : '画像をアップロードしてください。',
    attImageExplain2 : 'URL',
    attImageURLTooltip : 'URLを指定してください。',
    attOverSize : 'ファイルが許容容量を超えました。',
    attPreventType : 'ファイルは許可されたタイプではありません。',
    attVideoModalTitle : 'YouTubeの挿入',
    attVideoExplain1 : 'Youtube Embed Id',
    attVideoExplain2 : 'フレームサイズ',
    attVideoEmbedIdTooltip : 'YouTubeのEmbed idを教えてください。',
    attVideoWidthTooltip : '%',
    attVideoHeightTooltip : 'PX',
    attImageAndVideoTooltipWidthInput : '横',
    attImageAndVideoTooltipFloatRadio : '浮く',
    attImageAndVideoTooltipShapeRadio : '形',
    helpModalTitle : '質問',
    helpContent : [
        {'ctrl + z' : '元に戻す'},
        {'ctrl + y' : '再実行'},
        {'ctrl + b' : '太字'},
        {'ctrl + u' : '下線'},
        {'ctrl + i' : '傾く'},
        {'enter' : '新しいブロックに新しい行が追加されます。'},
        {'shift + enter' : '既存のブロックに新しい行を追加します。'},
        {'etc1' : 'モバイルでは、ドラッグ後のスタイルの適用のみが可能です。'},
        {'etc2' : '動画のアップロードにはYouTube Eembed idを利用する必要があります。'},
    ],
}
vnConfig.languageSet.JPN = jpnLanguagePack;
vnConfig.attributes.language = 'JPN';
const vn: Vanillanote = getVanillanote(vnConfig);
vn.init();

// 2. 전역 속성으로 등록
app.config.globalProperties.$vn = vn;

// 3. 앱 마운트
app.use(router).mount('#app');
