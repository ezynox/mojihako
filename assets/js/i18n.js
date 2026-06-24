"use strict";
// i18n.js - MojiHako UI translations
(function () {
    const DEFAULT_LANG = "en";
    const LOCALIZED_PATH_PREFIXES = new Set(["ko", "ja", "jp", "en"]);
    const TOOL_KEY_MATCHERS = [
        ["width-converter", "width"],
        ["kana-converter", "kana"],
        ["kana-pad", "kanaPad"],
        ["kaomoji-copy", "kaomoji"],
        ["japanese-era-converter", "era"],
        ["genko-yoshi-viewer", "genko"],
        ["#tool-list", "list"],
    ];
    const FOOTER_KEY_MATCHERS = [
        ["#top", "top"],
        ["about", "about"],
        ["privacy", "privacy"],
        ["terms", "terms"],
    ];

    const messages = {
        ko: {
            common: {
                skipToMain: "본문으로 이동",
                brandHome: "MojiHako 홈",
                languageNav: "언어 선택",
                toolNav: "도구 메뉴",
                footerNav: "하단 사이트 링크",
                adArea: "",
                input: "입력",
                result: "결과",
                search: "검색",
                convertMode: "변환 방식",
                live: "자동 변환",
                convert: "변환",
                copy: "복사",
                clear: "삭제",
                sendToTools: "결과를 다른 도구로 보내기",
            },
            language: {
                ko: "한국어",
                ja: "日本語",
                en: "English",
            },
            tools: {
                width: {
                    nav: "전각/반각",
                    short: "전각/반각",
                },
                kana: {
                    nav: "가나 변환",
                    short: "히라가나/가타카나",
                },
                kanaPad: {
                    nav: "일본어 입력",
                    short: "Kana Pad",
                },
                kaomoji: {
                    nav: "카오모지",
                    short: "Kaomoji Copy",
                },
                era: {
                    nav: "일본 연호",
                    short: "일본 연호",
                },
                genko: {
                    nav: "원고지",
                    short: "원고지",
                },
                list: "도구 목록",
            },
            footer: {
                top: "맨 위로 돌아가기",
                about: "소개",
                contact: "문의",
                privacy: "개인정보처리방침",
                terms: "이용약관",
                privacyNote: "입력한 텍스트를 서버로 전송하지 않고, 브라우저 안에서만 처리합니다.",
            },
            placeholders: {
                kanaInput: "예: ひらがな カタカナ 東京 abc 123",
                widthInput: "예: ＡＢＣ１２３ ｶﾀｶﾅ ① Ⅳ",
                converterOutput: "변환 결과가 여기에 표시됩니다.",
                kanaPadOutput: "ここに入力されます",
                kanaPadSearch: "ka, tsu, xya, か, 가, 작은요",
                kaomojiSearch: "love, cry, cat, 기쁨, 동물",
                genkoInput: "원고지에 넣을 텍스트를 입력하거나 TXT 파일을 불러오세요.",
            },
            modes: {
                hiraToKata: "히라가나 → 가타카나",
                kataToHira: "가타카나 → 히라가나",
                fullToHalf: "전각 ASCII → 반각 ASCII",
                halfToFull: "반각 ASCII → 전각 ASCII",
                halfKanaToFull: "반각 가타카나 → 전각 가타카나",
                fullKanaToHalf: "전각 가타카나 → 반각 가타카나",
                fullSpaceToHalf: "전각 공백 → 반각 공백",
                halfSpaceToFull: "반각 공백 → 전각 공백",
                nfkc: "NFKC 정규화",
            },
            era: {
                gregorianDate: "서기 날짜",
                gannen: "원년 표기",
                korean: "한국어 표기",
                roman: "로마자/약어 표시",
                dayNavigation: "날짜 이동",
                yearNavigation: "연도 이동",
                dayJumpLabels: {
                    minus1: "← 1일",
                    today: "오늘",
                    plus1: "1일 →",
                },
                monthJumpLabels: {
                    minus1: "← 1월",
                    plus1: "1월 →",
                },
                yearJumpLabels: {
                    minus10: "← 10년",
                    minus1: "← 1년",
                    plus1: "1년 →",
                    plus10: "10년 →",
                },
                majorStarts: "일본 주요 연호 시작 날짜",
                starts: {
                    reiwa: "레이와 시작일",
                    heisei: "헤이세이 시작일",
                    showa: "쇼와 시작일",
                    taisho: "타이쇼 시작일",
                    meiji: "메이지 시작일",
                    taika: "다이카 시작일",
                    // reiwa: "令和 시작일",
                    // heisei: "平成 시작일",
                    // showa: "昭和 시작일",
                    // taisho: "大正 시작일",
                    // // meiji: "明治 시작일",
                    // taika: "大化 시작일",
                },
                noDate: "날짜를 선택하세요.",
                invalidDate: "YYYY-MM-DD 형식의 올바른 날짜를 입력하세요.",
                rangeError: "지원하는 연호 범위를 벗어난 날짜입니다.",
            },
            genko: {
                title: "세로쓰기 원고지 뷰어",
                inputHeading: "텍스트 입력",
                textLabel: "원고지에 넣을 텍스트",
                fileLabel: "텍스트 파일 불러오기( .txt / .md )",
                filePrivacy: "TXT와 MD 파일을 서버로 업로드하지 않고 브라우저 안에서만 읽습니다.",
                settings: "설정",
                paperKind: "원고지 형식",
                paper400: "400자",
                paper200: "200자",
                viewMode: "보기 방식",
                pagedView: "페이지 단위 보기",
                allView: "전체 이어보기",
                options: "표시 옵션",
                showGrid: "원고지 그리드 표시",
                indentParagraph: "문단 첫 칸 들여쓰기",
                removeBlankLines: "공백줄 제거",
                respectLineBreaks: "줄바꿈 반영",
                kinsoku: "기본 금칙 처리 적용",
                kinsokuNote: "마침표, 쉼표, 닫는 괄호가 줄의 첫 칸에 오지 않도록 앞 줄 끝에 붙여 표시합니다.",
                stats: "계산 결과",
                totalCharacters: "전체 글자수",
                noSpaceCharacters: "공백 제외 글자수",
                lineCount: "줄 수",
                rawSheets: "단순 글자수 기준 매수",
                layoutSheets: "실제 칸수 기준 매수",
                viewer: "원고지 뷰어",
                first: "처음",
                prev: "이전",
                pageNumber: "페이지 번호",
                go: "이동",
                next: "다음",
                last: "끝",
                pageLabel: "{current} / {total} 페이지",
                characterUnitOne: "{value}자",
                characterUnit: "{value}자",
                lineUnitOne: "{value}줄",
                lineUnit: "{value}줄",
                sheetUnitOne: "{value}장",
                sheetUnit: "{value}장",
                fileLoaded: "{name} 파일을 불러왔습니다.",
                fileError: "파일을 읽지 못했습니다.",
            },
            kanaPad: {
                composeResult: "입력 결과",
                resultActions: "입력 결과 작업",
                copyResult: "입력 결과 복사",
                clearResult: "입력 결과 전체 삭제",
                backspace: "마지막 문자 삭제",
                space: "공백 입력",
                newline: "줄바꿈 입력",
                picker: "문자 선택",
                gojuonLayout: "오십음도 배열",
                categories: "Kana Pad 카테고리",
                grid: "가나 문자표",
                hiragana: "히라가나",
                katakana: "가타카나",
                hiraganaVoiced: "히라가나 탁음·반탁음",
                katakanaVoiced: "가타카나 탁음·반탁음",
                small: "작은 가나",
                symbols: "기호",
                insertValue: "{value} 입력",
            },
            kaomoji: {
                categories: "카오모지 카테고리",
                backToTop: "맨 위로",
                love: "사랑",
                cute: "귀여움",
                happy: "기쁨",
                cry: "울음",
                angry: "화남",
                shocked: "놀람",
                sleepy: "졸림",
                animal: "동물",
                greeting: "인사",
                gaming: "게임",
                embarrassed: "부끄러움",
                excited: "신남",
                sad: "슬픔",
                favorites: "즐겨찾기",
                recent: "최근 복사",
                copyValue: "{value} 복사",
                clickToCopy: "클릭해서 복사",
                removeFavorite: "즐겨찾기에서 제거",
                saveFavorite: "즐겨찾기에 저장",
            },
            status: {
                copiedShort: "복사됨",
                copied: "복사되었습니다.",
                copyUnsupported: "복사를 지원하지 않는 환경입니다.",
                cleared: "삭제되었습니다.",
                noSearchResults: "검색 결과가 없습니다.",
                noSavedItems: "저장된 항목이 없습니다.",
                noCharacters: "표시할 문자가 없습니다.",
                favoriteRemoved: "즐겨찾기에서 제거했습니다.",
                favoriteSaved: "즐겨찾기에 저장했습니다.",
            },
        },

        ja: {
            common: {
                skipToMain: "本文へ移動",
                brandHome: "MojiHako ホーム",
                languageNav: "言語選択",
                toolNav: "ツールメニュー",
                footerNav: "フッターリンク",
                adArea: "",
                input: "入力",
                result: "結果",
                search: "検索",
                convertMode: "変換方式",
                live: "自動変換",
                convert: "変換",
                copy: "コピー",
                clear: "クリア",
                sendToTools: "結果を別のツールへ送る",
            },
            language: {
                ko: "한국어",
                ja: "日本語",
                en: "English",
            },
            tools: {
                width: {
                    nav: "全角・半角",
                    short: "全角・半角",
                },
                kana: {
                    nav: "かな変換",
                    short: "ひらがな・カタカナ",
                },
                kanaPad: {
                    nav: "日本語入力",
                    short: "Kana Pad",
                },
                kaomoji: {
                    nav: "顔文字",
                    short: "Kaomoji Copy",
                },
                era: {
                    nav: "和暦",
                    short: "和暦",
                },
                genko: {
                    nav: "原稿用紙",
                    short: "原稿用紙",
                },
                list: "ツール一覧",
            },
            footer: {
                top: "ページ上部へ戻る",
                about: "サイト紹介",
                contact: "お問い合わせ",
                privacy: "プライバシーポリシー",
                terms: "利用規約",
                privacyNote: "入力したテキストはサーバーへ送信されず、ユーザーのブラウザ内だけで処理されます。",
            },
            placeholders: {
                kanaInput: "例: ひらがな カタカナ 東京 abc 123",
                widthInput: "例: ＡＢＣ１２３ ｶﾀｶﾅ ① Ⅳ",
                converterOutput: "変換結果がここに表示されます。",
                kanaPadOutput: "ここに入力されます",
                kanaPadSearch: "ka, tsu, xya, か, 小さいよ",
                kaomojiSearch: "love, cry, cat, happy, 喜び, 動物",
                genkoInput: "原稿用紙に入れるテキストを入力するか、TXT ファイルを読み込んでください。",
            },
            modes: {
                hiraToKata: "ひらがな → カタカナ",
                kataToHira: "カタカナ → ひらがな",
                fullToHalf: "全角 ASCII → 半角 ASCII",
                halfToFull: "半角 ASCII → 全角 ASCII",
                halfKanaToFull: "半角カタカナ → 全角カタカナ",
                fullKanaToHalf: "全角カタカナ → 半角カタカナ",
                fullSpaceToHalf: "全角スペース → 半角スペース",
                halfSpaceToFull: "半角スペース → 全角スペース",
                nfkc: "NFKC 正規化",
            },
            era: {
                gregorianDate: "西暦日付",
                gannen: "元年表記",
                korean: "韓国語表記",
                roman: "ローマ字・略号を表示",
                dayNavigation: "日付移動",
                yearNavigation: "年単位の移動",
                dayJumpLabels: {
                    minus1: "← 1日",
                    today: "今日",
                    plus1: "1日 →",
                },
                monthJumpLabels: {
                    minus1: "← 1月",
                    plus1: "1月 →",
                },
                yearJumpLabels: {
                    minus10: "← 10年",
                    minus1: "← 1年",
                    plus1: "1年 →",
                    plus10: "10年 →",
                },
                majorStarts: "主な元号の開始日",
                starts: {
                    reiwa: "令和の開始日",
                    heisei: "平成の開始日",
                    showa: "昭和の開始日",
                    taisho: "大正の開始日",
                    meiji: "明治の開始日",
                    taika: "大化の開始日",
                },
                // 버튼 안에서 너무 길면 아래걸로
                // majorStarts: "主な元号の開始日",
                // starts: {
                //     reiwa: "令和開始",
                //     heisei: "平成開始",
                //     showa: "昭和開始",
                //     taisho: "大正開始",
                //     meiji: "明治開始",
                //     taika: "大化開始",
                // },
                noDate: "日付を選択してください。",
                invalidDate: "YYYY-MM-DD 形式の正しい日付を入力してください。",
                rangeError: "対応する元号の範囲外の日付です。",
            },
            genko: {
                title: "縦書き原稿用紙ビューア",
                inputHeading: "テキスト入力",
                textLabel: "原稿用紙に入れるテキスト",
                fileLabel: "テキストファイルを読み込む（.txt / .md）",
                filePrivacy: "ファイルはサーバーにアップロードされず、ブラウザ内でのみ処理されます。",
                settings: "設定",
                paperKind: "原稿用紙形式",
                paper400: "400字",
                paper200: "200字",
                viewMode: "表示方式",
                pagedView: "ページ単位表示",
                allView: "全体を続けて表示",
                options: "表示オプション",
                showGrid: "原稿用紙の罫線を表示",
                indentParagraph: "段落の最初を一マス空ける",
                removeBlankLines: "空行を削除",
                respectLineBreaks: "改行を反映",
                kinsoku: "基本的な禁則処理を適用",
                kinsokuNote: "句読点や閉じ括弧が行頭に来ないように、前の行末に寄せて表示します。",
                stats: "計算結果",
                totalCharacters: "総文字数",
                noSpaceCharacters: "空白を除いた文字数",
                lineCount: "行数",
                rawSheets: "文字数換算",
                layoutSheets: "原稿用紙換算",
                viewer: "原稿用紙ビューア",
                first: "最初",
                prev: "前へ",
                pageNumber: "ページ番号",
                go: "移動",
                next: "次へ",
                last: "最後",
                pageLabel: "{current} / {total} ページ",
                characterUnitOne: "{value}字",
                characterUnit: "{value}字",
                lineUnitOne: "{value}行",
                lineUnit: "{value}行",
                sheetUnitOne: "{value}枚",
                sheetUnit: "{value}枚",
                fileLoaded: "{name} を読み込みました。",
                fileError: "ファイルを読み込めませんでした。",
            },
            kanaPad: {
                composeResult: "入力結果",
                resultActions: "入力結果の操作",
                copyResult: "入力結果をコピー",
                clearResult: "入力結果をすべて削除",
                backspace: "最後の文字を削除",
                space: "スペースを入力",
                newline: "改行を入力",
                picker: "文字選択",
                gojuonLayout: "五十音レイアウト",
                categories: "Kana Pad カテゴリ",
                grid: "かな文字表",
                hiragana: "ひらがな",
                katakana: "カタカナ",
                hiraganaVoiced: "濁音・半濁音（ひらがな）",
                katakanaVoiced: "濁音・半濁音（カタカナ）",
                small: "小書き仮名",
                symbols: "記号",
                insertValue: "{value} を入力",
            },
            kaomoji: {
                categories: "顔文字カテゴリ",
                backToTop: "TOPへ戻る",
                love: "恋愛",
                cute: "かわいい",
                happy: "喜び",
                cry: "泣き",
                angry: "怒り",
                shocked: "驚き",
                sleepy: "眠い",
                animal: "動物",
                greeting: "あいさつ",
                gaming: "ゲーム",
                embarrassed: "照れ",
                excited: "わくわく",
                sad: "悲しみ",
                favorites: "お気に入り",
                recent: "最近コピー",
                copyValue: "{value} をコピー",
                clickToCopy: "クリックしてコピー",
                removeFavorite: "お気に入りから削除",
                saveFavorite: "お気に入りに保存",
            },
            status: {
                copiedShort: "コピー済み",
                copied: "コピーしました。",
                copyUnsupported: "コピーに対応していない環境です。",
                cleared: "削除しました。",
                noSearchResults: "検索結果がありません。",
                noSavedItems: "保存された項目がありません。",
                noCharacters: "表示する文字がありません。",
                favoriteRemoved: "お気に入りから削除しました。",
                favoriteSaved: "お気に入りに保存しました。",
            },
        },

        en: {
            common: {
                skipToMain: "Skip to content",
                brandHome: "MojiHako home",
                languageNav: "Language selection",
                toolNav: "Tool menu",
                footerNav: "Footer site links",
                adArea: "Ad area",
                input: "Input",
                result: "Result",
                search: "Search",
                convertMode: "Conversion mode",
                live: "Live",
                convert: "Convert",
                copy: "Copy",
                clear: "Clear",
                sendToTools: "Send result to another tool",
            },
            language: {
                ko: "한국어",
                ja: "日本語",
                en: "English",
            },
            tools: {
                width: {
                    nav: "Full/Half Width",
                    short: "Full/Half Width",
                },
                kana: {
                    nav: "Kana Converter",
                    short: "Hiragana/Katakana",
                },
                kanaPad: {
                    nav: "Kana Pad",
                    short: "Kana Pad",
                },
                genko: {
                    nav: "Genko Paper",
                    short: "Genko Paper",
                },
                era: {
                    nav: "Japanese Era",
                    short: "Japanese Era",
                },
                kaomoji: {
                    nav: "Kaomoji",
                    short: "Kaomoji",
                },
                list: "All Tools",
            },
            footer: {
                top: "Back to Top",
                about: "About",
                contact: "Contact",
                terms: "Terms",
                privacy: "Privacy Policy",
                privacyNote: "Your text stays in your browser and is not sent to our server.",
            },
            placeholders: {
                kanaInput: "Example: ひらがな カタカナ 東京 abc 123",
                widthInput: "Example: ＡＢＣ１２３ ｶﾀｶﾅ ① Ⅳ",
                converterOutput: "Converted text will appear here.",
                kanaPadOutput: "Text appears here",
                kanaPadSearch: "ka, tsu, xya, か, small yo",
                kaomojiSearch: "love, cry, cat, happy",
                genkoInput: "Enter text for the manuscript grid, or load a TXT file.",
            },
            modes: {
                hiraToKata: "Hiragana → Katakana",
                kataToHira: "Katakana → Hiragana",
                fullToHalf: "Full-width ASCII → Half-width ASCII",
                halfToFull: "Half-width ASCII → Full-width ASCII",
                halfKanaToFull: "Half-width katakana → Full-width katakana",
                fullKanaToHalf: "Full-width katakana → Half-width katakana",
                fullSpaceToHalf: "Full-width space → Half-width space",
                halfSpaceToFull: "Half-width space → Full-width space",
                nfkc: "NFKC normalization",
            },
            era: {
                gregorianDate: "Gregorian Date",
                gannen: "Use gannen",
                korean: "Show Korean reading",
                roman: "Show romanization and abbreviation",
                dayNavigation: "Date navigation",
                yearNavigation: "Year navigation",
                dayJumpLabels: {
                    minus1: "← 1 day",
                    today: "Today",
                    plus1: "1 day →",
                },
                monthJumpLabels: {
                    minus1: "← 1 mo",
                    plus1: "1 mo →",
                },
                yearJumpLabels: {
                    minus10: "← 10 yrs",
                    minus1: "← 1 yr",
                    plus1: "1 yr →",
                    plus10: "10 yrs →",
                },
                majorStarts: "Major era start dates",
                starts: {
                    reiwa: "Reiwa start",
                    heisei: "Heisei start",
                    showa: "Showa start",
                    taisho: "Taisho start",
                    meiji: "Meiji start",
                    taika: "Taika start",
                },
                noDate: "Choose a date.",
                invalidDate: "Enter a valid date in YYYY-MM-DD format.",
                rangeError: "This date is outside the supported era ranges.",
            },
            genko: {
                title: "Vertical Genko Paper Viewer",
                inputHeading: "Text Input",
                textLabel: "Text for the manuscript grid",
                fileLabel: "Load text file( .txt / .md )",
                filePrivacy: "Files are read only in your browser and are not uploaded to a server.",
                settings: "Settings",
                paperKind: "Paper Format",
                paper400: "400 characters",
                paper200: "200 characters",
                viewMode: "View Mode",
                pagedView: "Paged view",
                allView: "Continuous view",
                options: "Display Options",
                showGrid: "Show manuscript grid",
                indentParagraph: "Indent first cell of paragraphs",
                removeBlankLines: "Remove blank lines",
                respectLineBreaks: "Respect line breaks",
                kinsoku: "Apply basic kinsoku handling",
                kinsokuNote: "Closing punctuation and closing brackets are kept away from the beginning of a line.",
                stats: "Stats",
                totalCharacters: "Total characters",
                noSpaceCharacters: "Characters excluding spaces",
                lineCount: "Lines",
                rawSheets: "Sheets (by characters)",
                layoutSheets: "Sheets (by layout)",
                viewer: "Genko Viewer",
                first: "First",
                prev: "Previous",
                pageNumber: "Page number",
                go: "Go",
                next: "Next",
                last: "Last",
                pageLabel: "Page {current} / {total}",
                characterUnitOne: "{value} char",
                characterUnit: "{value} chars",
                lineUnitOne: "{value} line",
                lineUnit: "{value} lines",
                sheetUnitOne: "{value} sheet",
                sheetUnit: "{value} sheets",
                fileLoaded: "Loaded {name}.",
                fileError: "Could not read the file.",
            },
            kanaPad: {
                composeResult: "Composed Text",
                resultActions: "Composed text actions",
                copyResult: "Copy composed text",
                clearResult: "Clear composed text",
                backspace: "Delete previous character",
                space: "Insert space",
                newline: "Insert newline",
                picker: "Character picker",
                gojuonLayout: "Traditional Kana Chart",
                categories: "Kana Pad categories",
                grid: "Kana grid",
                hiragana: "Hiragana",
                katakana: "Katakana",
                hiraganaVoiced: "Voiced Hiragana",
                katakanaVoiced: "Voiced Katakana",
                small: "Small kana",
                symbols: "Symbols",
                insertValue: "Insert {value}",
            },
            kaomoji: {
                categories: "Kaomoji categories",
                backToTop: "Back to top",
                love: "Love",
                cute: "Cute",
                happy: "Happy",
                cry: "Cry",
                angry: "Angry",
                shocked: "Shocked",
                sleepy: "Sleepy",
                animal: "Animal",
                greeting: "Greeting",
                gaming: "Gaming",
                embarrassed: "Embarrassed",
                excited: "Excited",
                sad: "Sad",
                favorites: "Favorites",
                recent: "Recent",
                copyValue: "Copy {value}",
                clickToCopy: "Click to copy",
                removeFavorite: "Remove from favorites",
                saveFavorite: "Save to favorites",
            },
            status: {
                copiedShort: "Copied",
                copied: "Copied.",
                copyUnsupported: "Copy is not supported in this environment.",
                cleared: "Cleared.",
                noSearchResults: "No search results.",
                noSavedItems: "No saved items.",
                noCharacters: "No characters to show.",
                favoriteRemoved: "Removed from favorites.",
                favoriteSaved: "Saved to favorites.",
            },
        },
    };

    function languageFromFirstSegment(firstSegment) {
        if (firstSegment === "ko") return "ko";
        if (firstSegment === "ja" || firstSegment === "jp") return "ja";
        if (firstSegment === "en") return "en";
        return DEFAULT_LANG;
    }

    function languageFromPathname(pathname) {
        return languageFromFirstSegment(pathname.split("/").filter(Boolean)[0]);
    }

    function detectLanguage() {
        return languageFromPathname(window.location.pathname);
    }

    const currentLanguage = detectLanguage();

    function messageFor(language, key) {
        return key.split(".").reduce((value, part) => value && value[part], messages[language]);
    }

    function formatMessage(template, params = {}) {
        return String(template).replace(/\{(\w+)\}/g, (match, name) => {
            return Object.prototype.hasOwnProperty.call(params, name) ? params[name] : match;
        });
    }

    function t(key, params) {
        const value = messageFor(currentLanguage, key) ?? messageFor(DEFAULT_LANG, key) ?? key;
        return formatMessage(value, params);
    }

    function setText(element, key) {
        if (element) element.textContent = t(key);
    }

    function setAttr(element, attr, key) {
        if (element) element.setAttribute(attr, t(key));
    }

    function setLabelWithInput(input, key) {
        if (!input) return;
        const label = input.closest("label");
        if (!label) return;
        label.replaceChildren(input, document.createTextNode(` ${t(key)}`));
    }

    function matchingKey(value, matchers) {
        if (!value) return "";
        const match = matchers.find(([pattern]) => value.includes(pattern));
        return match ? match[1] : "";
    }

    function toolKeyFromHref(href) {
        return matchingKey(href, TOOL_KEY_MATCHERS);
    }

    function toolKeyFromPath(pathname = window.location.pathname) {
        return matchingKey(pathname, TOOL_KEY_MATCHERS);
    }

    function footerKeyFromHref(href) {
        return matchingKey(href, FOOTER_KEY_MATCHERS);
    }

    function languageKeyFromHref(href) {
        const url = new URL(href, window.location.href);
        return languageFromPathname(url.pathname);
    }

    function localizedPathFor(language) {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const currentPrefix = LOCALIZED_PATH_PREFIXES.has(segments[0]) ? segments[0] : "";
        const pageSegments = currentPrefix ? segments.slice(1) : segments;
        const pagePath = pageSegments.length ? `/${pageSegments.join("/")}${window.location.pathname.endsWith("/") ? "/" : ""}` : "/";
        if (language === "ko") return pagePath === "/" ? "/ko/" : `/ko${pagePath}`;
        if (language === "ja") return pagePath === "/" ? "/ja/" : `/ja${pagePath}`;
        return pagePath;
    }

    function applyStaticUi(root = document) {
        root.querySelectorAll("[data-i18n-text]").forEach((element) => {
            setText(element, element.dataset.i18nText);
        });
        root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            setAttr(element, "placeholder", element.dataset.i18nPlaceholder);
        });
        root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            setAttr(element, "aria-label", element.dataset.i18nAriaLabel);
        });
        root.querySelectorAll("[data-i18n-title]").forEach((element) => {
            setAttr(element, "title", element.dataset.i18nTitle);
        });

        setText(root.querySelector(".skip-link"), "common.skipToMain");
        setAttr(root.querySelector(".brand"), "aria-label", "common.brandHome");
        setAttr(root.querySelector(".language-nav"), "aria-label", "common.languageNav");
        setAttr(root.querySelector(".tool-nav"), "aria-label", "common.toolNav");
        setAttr(root.querySelector(".footer-nav"), "aria-label", "common.footerNav");

        root.querySelectorAll(".ad-slot").forEach((slot) => {
            setAttr(slot, "aria-label", "common.adArea");
            setText(slot.querySelector("span"), "common.adArea");
        });

        root.querySelectorAll(".language-nav a").forEach((link) => {
            const languageKey = languageKeyFromHref(link.getAttribute("href"));
            link.setAttribute("href", localizedPathFor(languageKey));
            setText(link, `language.${languageKey}`);
            if (languageKey === currentLanguage) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

        root.querySelectorAll(".tool-nav a").forEach((link) => {
            const href = link.getAttribute("href");
            const key = href === "./" ? toolKeyFromPath() : toolKeyFromHref(href);
            if (key === "list") setText(link, "tools.list");
            else if (key) setText(link, `tools.${key}.nav`);
        });

        root.querySelectorAll(".footer-nav a").forEach((link) => {
            const href = link.getAttribute("href");
            const footerKey = footerKeyFromHref(href);
            const toolKey = href === "./" ? toolKeyFromPath() : toolKeyFromHref(href);
            if (footerKey) setText(link, `footer.${footerKey}`);
            else if (toolKey === "list") setText(link, "tools.list");
            else if (toolKey) setText(link, `tools.${toolKey}.nav`);
        });
        setText(root.querySelector(".footer-note"), "footer.privacyNote");

        root.querySelectorAll(".handoff-links").forEach((group) => {
            setAttr(group, "aria-label", "common.sendToTools");
            setText(group.querySelector("span"), "common.sendToTools");
            group.querySelectorAll("[data-handoff-target]").forEach((link) => {
                const key = toolKeyFromHref(link.getAttribute("href"));
                if (key) setText(link, `tools.${key}.short`);
            });
        });

        setText(root.querySelector('label[for="kana-input"]'), "common.input");
        setText(root.querySelector('label[for="width-input"]'), "common.input");
        setText(root.querySelector('label[for="kana-output"]'), "common.result");
        setText(root.querySelector('label[for="width-output"]'), "common.result");
        setText(root.querySelector('label[for="kana-pad-output"]'), "kanaPad.composeResult");
        setText(root.querySelector('label[for="era-date"]'), "era.gregorianDate");
        root.querySelectorAll(".search-field .field-label").forEach((label) => setText(label, "common.search"));

        root.querySelectorAll(".option-grid legend:not([data-i18n-text])").forEach((legend) => setText(legend, "common.convertMode"));
        setLabelWithInput(root.querySelector('input[value="hira-to-kata"]'), "modes.hiraToKata");
        setLabelWithInput(root.querySelector('input[value="kata-to-hira"]'), "modes.kataToHira");
        setLabelWithInput(root.querySelector('input[value="full-to-half"]'), "modes.fullToHalf");
        setLabelWithInput(root.querySelector('input[value="half-to-full"]'), "modes.halfToFull");
        setLabelWithInput(root.querySelector('input[value="half-kana-to-full"]'), "modes.halfKanaToFull");
        setLabelWithInput(root.querySelector('input[value="full-kana-to-half"]'), "modes.fullKanaToHalf");
        setLabelWithInput(root.querySelector('input[value="full-space-to-half"]'), "modes.fullSpaceToHalf");
        setLabelWithInput(root.querySelector('input[value="half-space-to-full"]'), "modes.halfSpaceToFull");
        setLabelWithInput(root.querySelector('input[value="nfkc"]'), "modes.nfkc");

        root.querySelectorAll(".live-toggle-inline span").forEach((span) => setText(span, "common.live"));
        root.querySelectorAll("[data-convert]").forEach((button) => setText(button, "common.convert"));
        root.querySelectorAll("[data-copy]").forEach((button) => setText(button, "common.copy"));
        root.querySelectorAll("[data-clear]").forEach((button) => setText(button, "common.clear"));
        setAttr(root.querySelector(".era-preset-row"), "aria-label", "era.dayNavigation");
        setAttr(root.querySelector(".era-year-jump-row"), "aria-label", "era.yearNavigation");
        setAttr(root.querySelector(".era-start-row"), "aria-label", "era.majorStarts");
        root.querySelectorAll("[data-era-relative]").forEach((button) => {
            const key = { "-1": "minus1", "0": "today", "1": "plus1" }[button.dataset.eraRelative];
            if (key) setText(button, `era.dayJumpLabels.${key}`);
        });
        root.querySelectorAll("[data-month-jump]").forEach((button) => {
            const key = { "-1": "minus1", "1": "plus1" }[button.dataset.monthJump];
            if (key) setText(button, `era.monthJumpLabels.${key}`);
        });
        root.querySelectorAll("[data-year-jump]").forEach((button) => {
            const key = { "-10": "minus10", "-1": "minus1", "1": "plus1", "10": "plus10" }[button.dataset.yearJump];
            if (key) setText(button, `era.yearJumpLabels.${key}`);
        });
        root.querySelectorAll("[data-era-start]").forEach((button) => {
            setText(button, `era.starts.${button.dataset.eraStart}`);
        });

        setLabelWithInput(root.querySelector("#era-gannen"), "era.gannen");
        setLabelWithInput(root.querySelector("#era-korean"), "era.korean");
        setLabelWithInput(root.querySelector("#era-roman"), "era.roman");
        setLabelWithInput(root.querySelector("#kana-gojuon-layout-toggle"), "kanaPad.gojuonLayout");

        setAttr(root.querySelector("#kana-input"), "placeholder", "placeholders.kanaInput");
        setAttr(root.querySelector("#width-input"), "placeholder", "placeholders.widthInput");
        setAttr(root.querySelector("#kana-output"), "placeholder", "placeholders.converterOutput");
        setAttr(root.querySelector("#width-output"), "placeholder", "placeholders.converterOutput");
        setAttr(root.querySelector("#kana-pad-output"), "placeholder", "placeholders.kanaPadOutput");
        setAttr(root.querySelector("#kana-pad-search"), "placeholder", "placeholders.kanaPadSearch");
        setAttr(root.querySelector("#kaomoji-search"), "placeholder", "placeholders.kaomojiSearch");

        const kanaActionKeys = {
            copy: ["common.copy", "kanaPad.copyResult"],
            clear: ["common.clear", "kanaPad.clearResult"],
            backspace: [null, "kanaPad.backspace"],
            space: [null, "kanaPad.space"],
            newline: [null, "kanaPad.newline"],
        };
        root.querySelectorAll("[data-kana-action]").forEach((button) => {
            const keys = kanaActionKeys[button.dataset.kanaAction];
            if (!keys) return;
            if (keys[0]) setText(button, keys[0]);
            setAttr(button, "aria-label", keys[1]);
        });
        setAttr(root.querySelector(".kana-actions"), "aria-label", "kanaPad.resultActions");
        setAttr(root.querySelector(".kana-picker-panel"), "aria-label", "kanaPad.picker");
        setAttr(root.querySelector("[data-kana-tabs]"), "aria-label", "kanaPad.categories");
        setAttr(root.querySelector("[data-kana-grid]"), "aria-label", "kanaPad.grid");
        root.querySelectorAll("[data-kana-tab]").forEach((button) => {
            const key = `kanaPad.${button.dataset.kanaTab}`;
            setAttr(button, "aria-label", key);
            setAttr(button, "title", key);
        });

        setAttr(root.querySelector("[data-kaomoji-tabs]"), "aria-label", "kaomoji.categories");
        root.querySelectorAll("[data-kaomoji-tab]").forEach((button) => {
            setText(button, `kaomoji.${button.dataset.kaomojiTab}`);
        });
    }

    window.MojiHakoI18n = {
        lang: currentLanguage,
        messages,
        t,
        applyStaticUi,
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => applyStaticUi());
    } else {
        applyStaticUi();
    }
}());
