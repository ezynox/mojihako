(function () {
    const i18n = window.MojiHakoI18n;
    const uiText = (key, params) => i18n ? i18n.t(key, params) : key;
    const fieldFlashTimers = new WeakMap();

    const halfKanaMap = new Map(Object.entries({
        "｡": "。", "｢": "「", "｣": "」", "､": "、", "･": "・",
        "ｦ": "ヲ", "ｧ": "ァ", "ｨ": "ィ", "ｩ": "ゥ", "ｪ": "ェ", "ｫ": "ォ",
        "ｬ": "ャ", "ｭ": "ュ", "ｮ": "ョ", "ｯ": "ッ", "ｰ": "ー",
        "ｱ": "ア", "ｲ": "イ", "ｳ": "ウ", "ｴ": "エ", "ｵ": "オ",
        "ｶ": "カ", "ｷ": "キ", "ｸ": "ク", "ｹ": "ケ", "ｺ": "コ",
        "ｻ": "サ", "ｼ": "シ", "ｽ": "ス", "ｾ": "セ", "ｿ": "ソ",
        "ﾀ": "タ", "ﾁ": "チ", "ﾂ": "ツ", "ﾃ": "テ", "ﾄ": "ト",
        "ﾅ": "ナ", "ﾆ": "ニ", "ﾇ": "ヌ", "ﾈ": "ネ", "ﾉ": "ノ",
        "ﾊ": "ハ", "ﾋ": "ヒ", "ﾌ": "フ", "ﾍ": "ヘ", "ﾎ": "ホ",
        "ﾏ": "マ", "ﾐ": "ミ", "ﾑ": "ム", "ﾒ": "メ", "ﾓ": "モ",
        "ﾔ": "ヤ", "ﾕ": "ユ", "ﾖ": "ヨ", "ﾗ": "ラ", "ﾘ": "リ",
        "ﾙ": "ル", "ﾚ": "レ", "ﾛ": "ロ", "ﾜ": "ワ", "ﾝ": "ン",
        "ﾞ": "゛", "ﾟ": "゜"
    }));

    const voicedKanaMap = new Map(Object.entries({
        "カ゛": "ガ", "キ゛": "ギ", "ク゛": "グ", "ケ゛": "ゲ", "コ゛": "ゴ",
        "サ゛": "ザ", "シ゛": "ジ", "ス゛": "ズ", "セ゛": "ゼ", "ソ゛": "ゾ",
        "タ゛": "ダ", "チ゛": "ヂ", "ツ゛": "ヅ", "テ゛": "デ", "ト゛": "ド",
        "ハ゛": "バ", "ヒ゛": "ビ", "フ゛": "ブ", "ヘ゛": "ベ", "ホ゛": "ボ",
        "ウ゛": "ヴ", "ワ゛": "ヷ", "ヰ゛": "ヸ", "ヱ゛": "ヹ", "ヲ゛": "ヺ",
        "ハ゜": "パ", "ヒ゜": "ピ", "フ゜": "プ", "ヘ゜": "ペ", "ホ゜": "ポ"
    }));

    const fullKanaMap = new Map(Array.from(halfKanaMap, ([half, full]) => [full, half]));
    const fullVoicedKanaMap = new Map(Array.from(voicedKanaMap, ([fullSequence, voiced]) => {
        const halfSequence = Array.from(fullSequence).map((char) => fullKanaMap.get(char) || char).join("");
        return [voiced, halfSequence];
    }));

    const eras = [
        { name: "令和", korean: "레이와", roman: "Reiwa", short: "R", start: "2019-05-01", startYear: 2019 },
        { name: "平成", korean: "헤이세이", roman: "Heisei", short: "H", start: "1989-01-08", end: "2019-04-30", startYear: 1989 },
        { name: "昭和", korean: "쇼와", roman: "Showa", short: "S", start: "1926-12-25", end: "1989-01-07", startYear: 1926 },
        { name: "大正", korean: "다이쇼", roman: "Taisho", short: "T", start: "1912-07-30", end: "1926-12-24", startYear: 1912 },
        { name: "明治", korean: "메이지", roman: "Meiji", short: "M", start: "1868-01-25", end: "1912-07-29", startYear: 1868 },
        { name: "大化", korean: "다이카", roman: "Taika", short: "Taika", start: "0645-06-19", end: "0650-03-21", startYear: 645 }
    ].map((era) => {
        const startDate = dateFromInputValue(era.start);
        const endDate = era.end ? dateFromInputValue(era.end) : null;
        return {
            ...era,
            startTime: startDate ? startDate.getTime() : -Infinity,
            endTime: endDate ? endDate.getTime() : Infinity,
        };
    });

    // kana pad 가로모드 배치
    const gojuonColumnsByTab = {
        hiragana: [
            ["あ", "い", "う", "え", "お"],
            ["か", "き", "く", "け", "こ"],
            ["さ", "し", "す", "せ", "そ"],
            ["た", "ち", "つ", "て", "と"],
            ["な", "に", "ぬ", "ね", "の"],
            ["は", "ひ", "ふ", "へ", "ほ"],
            ["ま", "み", "む", "め", "も"],
            ["や", "",   "ゆ", "",  "よ"],
            ["ら", "り", "る", "れ", "ろ"],
            ["わ", "",   "を", "",   "ん"],
            // ["わ", "を", "ん", "", "" ],
        ],
        katakana: [
            ["ア", "イ", "ウ", "エ", "オ"],
            ["カ", "キ", "ク", "ケ", "コ"],
            ["サ", "シ", "ス", "セ", "ソ"],
            ["タ", "チ", "ツ", "テ", "ト"],
            ["ナ", "ニ", "ヌ", "ネ", "ノ"],
            ["ハ", "ヒ", "フ", "ヘ", "ホ"],
            ["マ", "ミ", "ム", "メ", "モ"],
            ["ヤ", "",   "ユ", "",  "ヨ"],
            ["ラ", "リ", "ル", "レ", "ロ"],
            ["ワ", "",   "ヲ", "",   "ン"],
            // ["ワ", "ヲ", "ン", "", ""],
        ],
    };

    const gojuonRowsByTab = {
        hiraganaVoiced: [
            ["", "ぱ", "", "ば", "だ", "ざ", "が", ""],
            ["", "ぴ", "", "び", "ぢ", "じ", "ぎ", ""],
            ["", "ぷ", "", "ぶ", "づ", "ず", "ぐ", ""],
            ["", "ぺ", "", "べ", "で", "ぜ", "げ", ""],
            ["", "ぽ", "", "ぼ", "ど", "ぞ", "ご", ""],
        ],
        katakanaVoiced: [
            ["", "パ", "", "ヴ", "バ", "ダ", "ザ", "ガ", ""],
            ["", "ピ", "", "", "ビ", "ヂ", "ジ", "ギ", ""],
            ["", "プ", "", "", "ブ", "ヅ", "ズ", "グ", ""],
            ["", "ペ", "", "", "ベ", "デ", "ゼ", "ゲ", ""],
            ["", "ポ", "", "", "ボ", "ド", "ゾ", "ゴ", ""],
        ],
        small: [
            ["ァ", "ッ", "ャ", "ぁ", "っ", "ゃ"],
            ["ィ", "", "", "ぃ", "", ""],
            ["ゥ", "", "ュ", "ぅ", "", "ゅ"],
            ["ェ", "", "", "ぇ", "", ""],
            ["ォ", "", "ョ", "ぉ", "", "ょ"],
        ],
        symbols: rotateRowsClockwise([
            ["「", "」", "『", "』", "【", "】"],
            ["〈", "〉", "《", "》", "〔", "〕"],
            ["（", "）", "［", "］", "｛", "｝"],
            ["。", "、", "・", "‥", "…", "ー"],
            ["〜", "!", "?", "々", "〆", "◎"],
            ["♡", "♥", "☆", "★", "○", "●"],
            ["△", "▲", "▷", "▶", "◇", "◆"],
            ["¥", "€", "₩", "$", "※", "♪"],
        ]),
    };

    const kanaCategories = [
        {
            id: "hiragana",
            rows: [
                ["あ", "い", "う", "え", "お"],
                ["か", "き", "く", "け", "こ"],
                ["さ", "し", "す", "せ", "そ"],
                ["た", "ち", "つ", "て", "と"],
                ["な", "に", "ぬ", "ね", "の"],
                ["は", "ひ", "ふ", "へ", "ほ"],
                ["ま", "み", "む", "め", "も"],
                ["や", "", "ゆ", "", "よ"],
                ["ら", "り", "る", "れ", "ろ"],
                ["わ", "", "を", "", "ん"]
            ]
        },
        {
            id: "katakana",
            rows: [
                ["ア", "イ", "ウ", "エ", "オ"],
                ["カ", "キ", "ク", "ケ", "コ"],
                ["サ", "シ", "ス", "セ", "ソ"],
                ["タ", "チ", "ツ", "テ", "ト"],
                ["ナ", "ニ", "ヌ", "ネ", "ノ"],
                ["ハ", "ヒ", "フ", "ヘ", "ホ"],
                ["マ", "ミ", "ム", "メ", "モ"],
                ["ヤ", "", "ユ", "", "ヨ"],
                ["ラ", "リ", "ル", "レ", "ロ"],
                ["ワ", "", "ヲ", "", "ン"]
            ]
        },
        {
            id: "hiraganaVoiced",
            rows: [
                ["が", "ぎ", "ぐ", "げ", "ご"],
                ["ざ", "じ", "ず", "ぜ", "ぞ"],
                ["だ", "ぢ", "づ", "で", "ど"],
                ["ば", "び", "ぶ", "べ", "ぼ"],
                ["", "", "", "", ""],
                ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
            ]
        },
        {
            id: "katakanaVoiced",
            rows: [
                ["ガ", "ギ", "グ", "ゲ", "ゴ"],
                ["ザ", "ジ", "ズ", "ゼ", "ゾ"],
                ["ダ", "ヂ", "ヅ", "デ", "ド"],
                ["バ", "ビ", "ブ", "ベ", "ボ"],
                ["ヴ", "", "", "", ""],
                ["", "", "", "", ""],
                ["パ", "ピ", "プ", "ペ", "ポ"]
            ]
        },
        {
            id: "small",
            rows: [
                ["ゃ", "", "ゅ", "", "ょ"],
                ["っ", "", "", "", ""],
                ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ"],
                ["ャ", "", "ュ", "", "ョ"],
                ["ッ", "", "", "", ""],
                ["ァ", "ィ", "ゥ", "ェ", "ォ"]
            ]
        },
        {
            id: "symbols",
            rows: [
                ["「", "」", "『", "』", "【", "】"],
                ["〈", "〉", "《", "》", "〔", "〕"],
                ["（", "）", "［", "］", "｛", "｝"],
                ["。", "、", "・", "‥", "…", "ー"],
                ["〜", "!", "?", "々", "〆", "◎"],
                ["♡", "♥", "☆", "★", "○", "●"],
                ["△", "▲", "▷", "▶", "◇", "◆"],
                ["¥", "€", "₩", "$", "※", "♪"]
            ]
        }
    ];

    const kanaAliasEntries = [
        ["あア", "a 아"],
        ["いイ", "i 이"],
        ["うウ", "u 우 으"],
        ["えエ", "e 에"],
        ["おオ", "o 오"],

        ["ぁァ", "xa la small-a あ ア 小書き仮名 작은아"],
        ["ぃィ", "xi li small-i い イ 小書き仮名 작은이"],
        ["ぅゥ", "xu lu small-u う ウ 小書き仮名 작은우"],
        ["ぇェ", "xe le small-e え エ 小書き仮名 작은에"],
        ["ぉォ", "xo lo small-o お オ 小書き仮名 작은오"],

        ["かカ", "ka ca 카"],
        ["きキ", "ki 키"],
        ["くク", "ku 쿠 크"],
        ["けケ", "ke 케"],
        ["こコ", "ko 코"],

        ["がガ", "ga 가"],
        ["ぎギ", "gi 기"],
        ["ぐグ", "gu 구 그"],
        ["げゲ", "ge 게"],
        ["ごゴ", "go 고"],

        ["さサ", "sa 사"],
        ["しシ", "shi si 시"],
        ["すス", "su 수 스"],
        ["せセ", "se 세"],
        ["そソ", "so 소"],

        ["ざザ", "ja za 자"],
        ["じジ", "ji zi 지"],
        ["ずズ", "ju zu 주 즈"],
        ["ぜゼ", "je ze 제"],
        ["ぞゾ", "jo zo 조"],

        ["たタ", "ta 타"],
        ["ちチ", "chi ti 치"],
        ["つツ", "tsu tu chu 추 츠 쯔 쓰"],
        ["てテ", "te 테"],
        ["とト", "to 토"],

        ["だダ", "da 다"],
        ["ぢヂ", "di ji dzi 지"],
        ["づヅ", "du zu 주 즈"],
        ["でデ", "de 데"],
        ["どド", "do 도"],

        ["なナ", "na 나"],
        ["にニ", "ni 니"],
        ["ぬヌ", "nu 누 느"],
        ["ねネ", "ne 네"],
        ["のノ", "no 노"],

        ["はハ", "ha wa 하"],
        ["ひヒ", "hi 히"],
        ["ふフ", "fu hu who 후 흐"],
        ["へヘ", "he e 헤 에"],
        ["ほホ", "ho 호"],

        ["ばバ", "ba 바"],
        ["びビ", "bi 비"],
        ["ぶブ", "bu 부 브"],
        ["べベ", "be 베"],
        ["ぼボ", "bo 보"],

        ["ぱパ", "pa fa pha 파"],
        ["ぴピ", "pi fi phi  피"],
        ["ぷプ", "pu fu phu 푸 프"],
        ["ぺペ", "pe fe phe 페"],
        ["ぽポ", "po fo pho 포"],

        ["まマ", "ma 마"],
        ["みミ", "mi 미"],
        ["むム", "mu 무 므"],
        ["めメ", "me 메"],
        ["もモ", "mo 모"],

        ["やヤ", "ya 야"],
        ["ゆユ", "yu 유"],
        ["よヨ", "yo 요"],

        ["ゃャ", "xya lya small-ya や ヤ 小書き仮名 작은야"],
        ["ゅュ", "xyu lyu small-yu ゆ ユ 小書き仮名 작은유"],
        ["ょョ", "xyo lyo small-yo よ ヨ 小書き仮名 작은요"],
        ["っッ", "xtsu ltsu small-tsu tsu つ ツ sokuon 促音 小書き仮名 작은츠 작은쯔 촉음"],
        ["ゎヮ", "xwa lwa small-wa わ ワ 小書き仮名 작은와"],

        ["らラ", "ra 라"],
        ["りリ", "ri 리"],
        ["るル", "ru 루"],
        ["れレ", "re 레"],
        ["ろロ", "ro 로"],

        ["わワ", "wa 와"],
        ["をヲ", "wo o 오 워 를 을"],
        ["んン", "n nn ng 응 은 음 ㄴ 받침"],

        ["ヴ", "vu v bu 부 브 뷔"],
        ["ヵ", "xka lka small-ka カ か 小書き仮名 작은카"],
        ["ヶ", "xke lke small-ke ケ け 小書き仮名 작은케"],
    ];


    // const kanaAliasEntries = [
    //     ["あアぁァ", "a 아"],
    //     ["いイぃィ", "i 이"],
    //     ["うウぅゥヴ", "u vu 우 으 부 브"],
    //     ["えエぇェ", "e 에"],
    //     ["おオぉォ", "o 오"],
    //     ["かカがガ", "ka ga 카 가"],
    //     ["きキぎギ", "ki gi 키 기"],
    //     ["くクぐグ", "ku gu 쿠 구"],
    //     ["けケげゲ", "ke ge 케 게"],
    //     ["こコごゴ", "ko go 코 고"],
    //     ["さサざザ", "sa za 사 자"],
    //     ["しシじジ", "shi si ji zi 시 지"],
    //     ["すスずズ", "su zu 스 즈 수 주"],
    //     ["せセぜゼ", "se ze 세 제"],
    //     ["そソぞゾ", "so zo 소 조"],
    //     ["たタだダ", "ta da 타 다"],
    //     ["ちチぢヂ", "chi ti ji di 치 지"],
    //     ["つツっッづヅ", "tsu tu small tsu du 츠 쯔 작은츠 작은쯔 촉음 작은쓰 쓰 즈"],
    //     ["てテでデ", "te de 테 데"],
    //     ["とトどド", "to do 토 도"],
    //     ["なナ", "na 나"],
    //     ["にニ", "ni 니"],
    //     ["ぬヌ", "nu 누"],
    //     ["ねネ", "ne 네"],
    //     ["のノ", "no 노"],
    //     ["はハばバぱパ", "ha ba pa 하 바 파"],
    //     ["ひヒびビぴピ", "hi bi pi 히 비 피"],
    //     ["ふフぶブぷプ", "fu hu bu pu 후 부 푸"],
    //     ["へヘべベぺペ", "he be pe 헤 베 페"],
    //     ["ほホぼボぽポ", "ho bo po 호 보 포"],
    //     ["まマ", "ma 마"],
    //     ["みミ", "mi 미"],
    //     ["むム", "mu 무"],
    //     ["めメ", "me 메"],
    //     ["もモ", "mo 모"],
    //     ["やヤゃャ", "ya small ya 야 작은야"],
    //     ["ゆユゅュ", "yu small yu 유 작은유"],
    //     ["よヨょョ", "yo small yo 요 작은요"],
    //     ["ゃゅょっぁぃぅぇぉャュョッァィゥェォ", "small 작은 小 小さい"],
    //     ["らラ", "ra 라"],
    //     ["りリ", "ri 리"],
    //     ["るル", "ru 루"],
    //     ["れレ", "re 레"],
    //     ["ろロ", "ro 로"],
    //     ["わワ", "wa 와"],
    //     ["をヲ", "wo o 오 워 를 을"],
    //     ["んン", "n nn ng ing 응 은 음 ㄴ 받침"],
    //     // 특수문자는 현재 검색 안 되게 함
    //     ["。、", "period comma kuten touten punctuation 마침표 쉼표 구점 독점 일본어마침표 일본어쉼표 문장부호"],
    //     ["「」『』", "quote quotes quotation kagi kakko bracket 따옴표 인용부호 일본어따옴표 괄호 카기카코 카기 괄호"],
    //     ["【】〈〉《》〔〕（）［］｛｝", "bracket brackets parenthesis parentheses kakko 괄호 대괄호 중괄호 소괄호 꺾쇠괄호 일본어괄호"],
    //     ["…‥", "ellipsis dots 말줄임표 줄임표 점점점 점 두점"],
    //     ["・", "middle dot nakaguro 가운데점 중점 나카구로"],
    //     ["ー", "long vowel mark dash 장음 장음부호 긴소리 길게 대시"],
    //     ["〜", "wave tilde 물결 물결표 틸드"],
    //     ["々", "repetition mark noma 반복부호 반복 기호 노마"],
    //     ["〆", "shime 시메 마감"],
    //     ["※", "reference mark kome 참고표시 주석표시 당구장표시 코메"],
    //     ["♪", "music note 음표 음악"],
    //     ["♡♥", "heart love 하트 사랑"],
    //     ["☆★", "star 별"],
    //     ["○●◎", "circle maru 원 동그라미 마루"],
    //     ["△▲", "triangle sankaku 삼각형 세모 산카쿠"],
    //     ["▷▶", "play arrow 재생 화살표 플레이"],
    //     ["₩$¥€", "currency money won dollar yen euro 통화 돈 원 달러 엔 유로"]
    // ];

    function normalizeSearchText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFKC")
            .replace(/\s+/g, " ")
            .trim();
    }

    function katakanaToHiragana(text) {
        return String(text || "").replace(/[\u30a1-\u30f6]/g, (char) =>
            String.fromCharCode(char.charCodeAt(0) - 0x60));
    }

    function kanaSearchTokens(aliases) {
        const tokens = [];
        normalizeSearchText(aliases).split(" ").forEach((token) => {
            if (!token) return;
            if (!tokens.includes(token)) tokens.push(token);
            token.split("-").forEach((part) => {
                if (part.length < 2) return;
                if (!tokens.includes(part)) tokens.push(part);
            });
        });
        return tokens;
    }

    function isKanaSearchTerm(query) {
        return /[\u3041-\u3096\u30a1-\u30f6]/.test(query);
    }

    const kanaSearchEntries = kanaAliasEntries.map(([chars, aliases]) => {
        const normalizedAliases = normalizeSearchText(aliases);
        const normalizedChars = normalizeSearchText(chars);
        const kanaNormalizedText = katakanaToHiragana(`${normalizedChars} ${normalizedAliases}`);
        return {
            chars,
            aliases: normalizedAliases,
            normalizedChars: katakanaToHiragana(normalizedChars),
            kanaNormalizedText,
            tokens: kanaSearchTokens(aliases)
        };
    });

    const kanaSearchIndex = new Map();
    kanaSearchEntries.forEach((entry) => {
        Array.from(entry.chars).forEach((char) => kanaSearchIndex.set(char, entry));
    });

    function kanaMatches(entry, rawQuery) {
        const query = normalizeSearchText(rawQuery);
        if (!query) return true;

        if (isKanaSearchTerm(query)) {
            const kanaQuery = katakanaToHiragana(query);
            return entry.normalizedChars.includes(kanaQuery) || entry.kanaNormalizedText.includes(kanaQuery);
        }

        if (/^[a-z]$/.test(query)) {
            return entry.tokens.includes(query);
        }

        if (/^[a-z-]+$/.test(query)) {
            return entry.tokens.some((token) => token.startsWith(query));
        }

        return entry.aliases.includes(query);
    }

    function readStoredString(key, fallback = "") {
        try {
            return window.localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStoredString(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            return false;
        }
        return true;
    }

    function dynamicRows(items) {
        const rows = [];
        let current = [];
        items.forEach((item) => {
            if (Array.from(item).length > 2) {
                if (current.length) rows.push(current);
                rows.push([item]);
                current = [];
                return;
            }
            current.push(item);
            if (current.length === 5) {
                rows.push(current);
                current = [];
            }
        });
        if (current.length) rows.push(current);
        return rows;
    }

    function columnsToRows(columns) {
        const rowCount = Math.max(...columns.map((column) => column.length));
        const rows = [];
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
            rows.push(columns.map((column) => column[rowIndex] || ""));
        }
        return rows;
    }

    function rotateRowsClockwise(rows) {
        const columnCount = Math.max(...rows.map((row) => row.length));
        const rotated = [];
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
            const row = [];
            for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex -= 1) {
                row.push(rows[rowIndex][columnIndex] || "");
            }
            rotated.push(row);
        }
        return rotated;
    }

    function flashButton(button, text = uiText("status.copiedShort")) {
        if (!button) return;
        const original = button.textContent;
        button.textContent = text;
        button.classList.add("copied");
        window.setTimeout(() => {
            button.textContent = original;
            button.classList.remove("copied");
        }, 1100);
    }

    function flashField(field, className = "is-cleared") {
        if (!field) return;
        const previousTimer = fieldFlashTimers.get(field);
        if (previousTimer) window.clearTimeout(previousTimer);

        field.classList.add(className);
        fieldFlashTimers.set(field, window.setTimeout(() => {
            field.classList.remove(className);
            fieldFlashTimers.delete(field);
        }, 900));
    }

    function fallbackCopyText(text) {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.left = "-9999px";
        helper.style.top = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        return copied ? Promise.resolve() : Promise.reject(new Error("copy failed"));
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
        }
        return fallbackCopyText(text);
    }

    function transferredText() {
        const params = new URLSearchParams(window.location.search);
        return params.has("text") ? params.get("text") : null;
    }

    function applyTransferredText() {
        const text = transferredText();
        const receiver = document.querySelector("[data-receive-text]");
        if (text === null || !receiver) return;

        receiver.value = text;
        if (typeof receiver.setSelectionRange === "function") {
            receiver.setSelectionRange(text.length, text.length);
        }
    }

    function sourceText(source) {
        if (!source) return "";
        if ("value" in source) return source.value;
        return source.textContent || "";
    }

    const handoffGroups = Array.from(document.querySelectorAll("[data-handoff-source]"));

    function updateHandoffLinks() {
        handoffGroups.forEach((group) => {
            const source = document.getElementById(group.dataset.handoffSource);
            const text = sourceText(source);
            group.querySelectorAll("[data-handoff-target]").forEach((link) => {
                const target = link.dataset.handoffTarget;
                link.href = text ? `${target}?text=${encodeURIComponent(text)}` : target;
            });
        });
    }

    function selectedValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "";
    }

    function dateFromInputValue(value) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return null;

        const [, yearText, monthText, dayText] = match;
        const year = Number(yearText);
        const month = Number(monthText);
        const day = Number(dayText);
        const date = new Date(0);
        date.setFullYear(year, month - 1, day);
        date.setHours(0, 0, 0, 0);

        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }
        return date;
    }

    function formatDateInput(date) {
        const year = String(date.getFullYear()).padStart(4, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function todayDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function eraBaseDate(value) {
        return dateFromInputValue(value) || todayDate();
    }

    function daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function jumpEraDay(value, offset) {
        const nextDate = new Date(eraBaseDate(value).getTime());
        nextDate.setDate(nextDate.getDate() + offset);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate;
    }

    function jumpEraYear(value, offset) {
        const baseDate = eraBaseDate(value);
        const year = baseDate.getFullYear() + offset;
        const month = baseDate.getMonth() + 1;
        const day = Math.min(baseDate.getDate(), daysInMonth(year, month));
        const nextDate = new Date(0);
        nextDate.setFullYear(year, month - 1, day);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate;
    }

    function normalizeEraDateInput(value) {
        const digits = value.replace(/\D/g, "").slice(0, 8);
        if (digits.length <= 4) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
        return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }

    function fullAsciiToHalf(text) {
        return text.replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
            .replace(/\u3000/g, " ");
    }

    function halfAsciiToFull(text) {
        return text.replace(/[!-~]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0xfee0))
            .replace(/ /g, "　");
    }

    function halfKanaToFull(text) {
        let converted = "";
        for (const char of text) {
            converted += halfKanaMap.get(char) || char;
        }
        for (const [pattern, replacement] of voicedKanaMap) {
            converted = converted.replaceAll(pattern, replacement);
        }
        return converted;
    }

    function fullKanaToHalf(text) {
        let converted = text;
        for (const [full, half] of fullVoicedKanaMap) {
            converted = converted.replaceAll(full, half);
        }
        return Array.from(converted).map((char) => fullKanaMap.get(char) || char).join("");
    }

    function fullSpaceToHalf(text) {
        return text.replace(/\u3000/g, " ");
    }

    function halfSpaceToFull(text) {
        return text.replace(/ /g, "　");
    }

    function convertWidth(text) {
        switch (selectedValue("width-mode")) {
        case "half-to-full":
            return halfAsciiToFull(text);
        case "half-kana-to-full":
            return halfKanaToFull(text);
        case "full-kana-to-half":
            return fullKanaToHalf(text);
        case "full-space-to-half":
            return fullSpaceToHalf(text);
        case "half-space-to-full":
            return halfSpaceToFull(text);
        case "nfkc":
            return text.normalize("NFKC");
        case "full-to-half":
        default:
            return fullAsciiToHalf(text);
        }
    }

    function convertKana(text) {
        const mode = selectedValue("kana-mode");
        if (mode === "kata-to-hira") {
            return text.replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
        }
        return text.replace(/[\u3041-\u3096]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60));
    }

    const toolConverters = {
        kana: convertKana,
        width: convertWidth,
    };

    function convertTool(toolName) {
        const input = document.getElementById(`${toolName}-input`);
        const output = document.getElementById(`${toolName}-output`);
        const converter = toolConverters[toolName];
        if (!input || !output || !converter) return;

        output.value = converter(input.value);
        updateHandoffLinks();
    }

    const eraElements = {
        gannen: document.getElementById("era-gannen"),
        input: document.getElementById("era-date"),
        korean: document.getElementById("era-korean"),
        output: document.getElementById("era-output"),
        roman: document.getElementById("era-roman"),
    };

    function setEraOutput(text) {
        if (!eraElements.output) return;
        eraElements.output.textContent = text;
        updateHandoffLinks();
    }

    function convertEra() {
        const {
            input,
            output,
            gannen,
            korean: koreanOption,
            roman: romanOption,
        } = eraElements;
        if (!input || !output || !gannen || !koreanOption || !romanOption) return;

        const useGannen = gannen.checked;
        const showKorean = koreanOption.checked;
        const showRoman = romanOption.checked;
        if (!input.value) {
            setEraOutput(uiText("era.noDate"));
            return;
        }

        const target = dateFromInputValue(input.value);
        if (!target) {
            setEraOutput(input.value.length >= 10 ? uiText("era.invalidDate") : uiText("era.noDate"));
            return;
        }

        const targetTime = target.getTime();
        const era = eras.find((item) => targetTime >= item.startTime && targetTime <= item.endTime);
        if (!era) {
            setEraOutput(uiText("era.rangeError"));
            return;
        }

        const year = target.getFullYear() - era.startYear + 1;
        const eraYear = year === 1 && useGannen ? "元" : String(year);
        const koreanYear = year === 1 && useGannen ? "원년" : `${year}년`;
        const month = target.getMonth() + 1;
        const day = target.getDate();
        const japanese = `${era.name}${eraYear}年${month}月${day}日`;
        const korean = `${era.korean} ${koreanYear} ${month}월 ${day}일`;
        const roman = `${era.roman} ${year}`;
        const short = `${era.short}${year}`;
        const parts = [japanese];

        if (i18n && i18n.lang === "ko") {
            if (showKorean) parts.push(korean);
            if (showRoman) parts.push(roman, short);
        } else {
            if (showRoman) parts.push(roman, short);
            if (showKorean) parts.push(korean);
        }

        setEraOutput(parts.join(" / "));
    }

    function copyOutput(toolName, button) {
        const output = document.getElementById(`${toolName}-output`);
        if (!output) return;

        copyText(output.value).then(() => {
            flashButton(button);
        }).catch(() => {
            output.select();
        });
    }

    function clearTool(toolName) {
        const input = document.getElementById(`${toolName}-input`);
        const output = document.getElementById(`${toolName}-output`);
        if (input) input.value = "";
        if (output) output.value = "";
        flashField(input);
        flashField(output);
        if (input) input.focus();
        updateHandoffLinks();
    }

    function syncConvertButtonVisibility(toolName) {
        const liveToggle = document.querySelector(`[data-live-toggle="${toolName}"]`);
        const convertButton = document.querySelector(`[data-convert="${toolName}"]`);
        if (!liveToggle || !convertButton) return;

        convertButton.hidden = liveToggle.checked;

        const label = liveToggle.closest(".live-toggle-inline");
        if (label) {
            label.classList.toggle("is-checked", liveToggle.checked);
        }
    }

    function bindLiveTool(toolName) {
        const input = document.getElementById(`${toolName}-input`);
        const liveToggle = document.querySelector(`[data-live-toggle="${toolName}"]`);
        if (!input || !liveToggle) return;

        syncConvertButtonVisibility(toolName);

        input.addEventListener("input", () => {
            if (liveToggle.checked) convertTool(toolName);
        });

        liveToggle.addEventListener("change", () => {
            syncConvertButtonVisibility(toolName);
            if (liveToggle.checked) convertTool(toolName);
        });

        document.querySelectorAll(`input[name="${toolName}-mode"]`).forEach((option) => {
            option.addEventListener("change", () => {
                if (liveToggle.checked) convertTool(toolName);
            });
        });
    }

    function bindClickAll(selector, handler) {
        document.querySelectorAll(selector).forEach((button) => {
            button.addEventListener("click", () => handler(button));
        });
    }

    function initKanaPad() {
        const root = document.querySelector("[data-kana-pad]");
        if (!root) return;

        const storagePrefix = "mojihako:kanaPad:";
        const output = root.querySelector("#kana-pad-output");
        const status = root.querySelector("[data-kana-status]");
        const searchInput = root.querySelector("[data-kana-search]");
        const grid = root.querySelector("[data-kana-grid]");
        const gridShell = root.querySelector(".kana-grid-shell");
        const gojuonToggle = root.querySelector("[data-kana-gojuon-layout-toggle]");
        const page = root.closest(".kana-pad-page");
        const tabButtons = Array.from(root.querySelectorAll("[data-kana-tab]"));
        const tabIds = tabButtons.map((button) => button.dataset.kanaTab);
        const compactOutputQuery = window.matchMedia("(max-width: 860px)");
        const gojuonLayoutStorageKey = "mojihako:kana-pad:gojuon-layout";
        let statusTimer = 0;
        let activeTab = readStoredString(`${storagePrefix}tab`, "hiragana");
        let isGojuonLayout = readStoredString(gojuonLayoutStorageKey) === "1";
        let caretStart = 0;
        let caretEnd = 0;

        if (!tabIds.includes(activeTab)) activeTab = "hiragana";
        output.value = transferredText() ?? "";
        caretStart = output.value.length;
        caretEnd = output.value.length;

        function setStatus(message) {
            if (!status) return;
            status.textContent = message;
            window.clearTimeout(statusTimer);
            statusTimer = window.setTimeout(() => {
                status.textContent = "";
            }, 1400);
        }

        function autoResizeOutput() {
            const maxHeight = isGojuonLayout
                ? (compactOutputQuery.matches ? 96 : 64)
                : (compactOutputQuery.matches ? 56 : 360);
            output.style.height = "auto";
            output.style.height = `${Math.min(output.scrollHeight, maxHeight)}px`;
        }

        function saveOutput() {
            return true;
        }

        function rememberCaret() {
            caretStart = output.selectionStart ?? output.value.length;
            caretEnd = output.selectionEnd ?? caretStart;
        }

        function placeCaret(position) {
            caretStart = position;
            caretEnd = position;
            output.setSelectionRange(position, position);
        }

        function allKanaValues() {
            const values = [];
            kanaCategories.forEach((category) => {
                if (category.id === "symbols") return;
                category.rows.forEach((row) => {
                    row.forEach((value) => {
                        if (value && !values.includes(value)) values.push(value);
                    });
                });
            });
            return values;
        }

        function searchRows() {
            const query = normalizeSearchText(searchInput.value);
            if (!query) return null;
            const terms = query.split(" ");
            const matches = allKanaValues().filter((value) => {
                const entry = kanaSearchIndex.get(value);
                return entry ? terms.every((term) => kanaMatches(entry, term)) : false;
            });
            return dynamicRows(matches);
        }

        function canUseGojuonLayout() {
            return isGojuonLayout && (Boolean(gojuonColumnsByTab[activeTab]) || Boolean(gojuonRowsByTab[activeTab]));
        }

        function activeGojuonRows() {
            if (gojuonRowsByTab[activeTab]) return gojuonRowsByTab[activeTab];
            const columns = gojuonColumnsByTab[activeTab];
            return columns ? columnsToRows([...columns].reverse()) : null;
        }

        function activeRows() {
            const filteredRows = searchRows();
            if (filteredRows) return filteredRows;
            if (canUseGojuonLayout()) return activeGojuonRows();
            const category = kanaCategories.find((item) => item.id === activeTab);
            return category ? category.rows : [];
        }

        function setGojuonLayout(enabled, shouldRender = true) {
            isGojuonLayout = enabled;
            root.classList.toggle("is-gojuon-layout", enabled);
            if (page) page.classList.toggle("is-gojuon-layout", enabled);
            if (gojuonToggle) gojuonToggle.checked = enabled;
            autoResizeOutput();
            if (shouldRender) renderGrid();
        }

        function focusKanaButton(button) {
            if (!button) return;
            grid.querySelectorAll(".kana-key").forEach((item) => {
                item.tabIndex = item === button ? 0 : -1;
            });
            button.focus();
        }

        function nearestButtonInRow(row, column) {
            const rowButtons = Array.from(grid.querySelectorAll(`.kana-key[data-row="${row}"]`));
            if (!rowButtons.length) return null;
            return rowButtons.reduce((closest, button) => {
                const distance = Math.abs(Number(button.dataset.col) - column);
                const closestDistance = Math.abs(Number(closest.dataset.col) - column);
                return distance < closestDistance ? button : closest;
            }, rowButtons[0]);
        }

        function moveGridFocus(current, key) {
            const row = Number(current.dataset.row);
            const column = Number(current.dataset.col);
            const rows = Array.from(grid.querySelectorAll(".kana-row"));
            let target = null;

            if (key === "ArrowLeft" || key === "ArrowRight") {
                const rowButtons = Array.from(grid.querySelectorAll(`.kana-key[data-row="${row}"]`))
                      .sort((a, b) => Number(a.dataset.col) - Number(b.dataset.col));
                const index = rowButtons.indexOf(current);
                target = rowButtons[index + (key === "ArrowRight" ? 1 : -1)];
            } else {
                const step = key === "ArrowDown" ? 1 : -1;
                let fallback = null;
                for (let nextRow = row + step; nextRow >= 0 && nextRow < rows.length; nextRow += step) {
                    target = grid.querySelector(`.kana-key[data-row="${nextRow}"][data-col="${column}"]`);
                    if (target) break;
                    if (!fallback) fallback = nearestButtonInRow(nextRow, column);
                }
                target = target || fallback;
            }

            if (target) focusKanaButton(target);
        }

        function insertText(text) {
            const start = Math.min(caretStart, output.value.length);
            const end = Math.min(caretEnd, output.value.length);
            output.value = `${output.value.slice(0, start)}${text}${output.value.slice(end)}`;
            const cursor = start + text.length;
            placeCaret(cursor);
            saveOutput();
            autoResizeOutput();
            updateHandoffLinks();
            setStatus(`${text} 입력`);
        }

        function deleteBeforeCursor() {
            const start = Math.min(caretStart, output.value.length);
            const end = Math.min(caretEnd, output.value.length);
            if (start !== end) {
                output.value = `${output.value.slice(0, start)}${output.value.slice(end)}`;
                placeCaret(start);
            } else if (start > 0) {
                const before = output.value.slice(0, start);
                const beforeChars = Array.from(before);
                beforeChars.pop();
                const nextStart = beforeChars.join("").length;
                output.value = `${beforeChars.join("")}${output.value.slice(start)}`;
                placeCaret(nextStart);
            }
            saveOutput();
            autoResizeOutput();
            updateHandoffLinks();
            output.focus();
        }

        function renderGrid() {
            const rows = activeRows();
            const isSearchMode = Boolean(searchInput.value.trim());
            const isGojuonMode = canUseGojuonLayout() && !isSearchMode;
            grid.classList.toggle("is-symbols", activeTab === "symbols" && !isSearchMode);
            grid.classList.toggle("is-gojuon", isGojuonMode);
            if (isGojuonMode) {
                const columnCount = Math.max(...rows.map((row) => row.length));
                grid.style.setProperty("--kana-gojuon-cols", String(columnCount));
                if (gridShell) gridShell.style.setProperty("--kana-gojuon-shell-width", `${Math.max(180, Math.min(760, columnCount * 76))}px`);
            } else {
                grid.style.removeProperty("--kana-gojuon-cols");
                if (gridShell) gridShell.style.removeProperty("--kana-gojuon-shell-width");
            }
            grid.replaceChildren();
            if (!rows.length) {
                const empty = document.createElement("p");
                empty.className = "empty-state";
                empty.textContent = searchInput.value.trim() ? uiText("status.noSearchResults") : uiText("status.noCharacters");
                grid.appendChild(empty);
                return;
            }

            let firstButton = null;
            rows.forEach((row, rowIndex) => {
                const rowElement = document.createElement("div");
                rowElement.className = "kana-row";
                rowElement.setAttribute("role", "row");
                row.forEach((value, columnIndex) => {
                    if (!value) {
                        const empty = document.createElement("span");
                        empty.className = "kana-empty kana-cell kana-cell-empty";
                        empty.setAttribute("aria-hidden", "true");
                        rowElement.appendChild(empty);
                        return;
                    }

                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = `kana-key${Array.from(value).length > 2 ? " is-long" : ""}`;
                    button.textContent = value;
                    button.dataset.kanaValue = value;
                    button.dataset.row = String(rowIndex);
                    button.dataset.col = String(columnIndex);
                    button.setAttribute("role", "gridcell");
                    button.setAttribute("aria-label", uiText("kanaPad.insertValue", { value }));
                    button.tabIndex = firstButton ? -1 : 0;
                    button.addEventListener("click", () => insertText(value));
                    button.addEventListener("keydown", (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            insertText(value);
                            return;
                        }
                        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                            event.preventDefault();
                            moveGridFocus(button, event.key);
                        }
                    });
                    if (!firstButton) firstButton = button;
                    rowElement.appendChild(button);
                });
                grid.appendChild(rowElement);
            });
        }

        function setActiveTab(tabId, shouldFocus = false) {
            if (!tabIds.includes(tabId)) return;
            activeTab = tabId;
            writeStoredString(`${storagePrefix}tab`, activeTab);
            tabButtons.forEach((button) => {
                const selected = button.dataset.kanaTab === activeTab;
                button.setAttribute("aria-selected", selected ? "true" : "false");
                button.tabIndex = selected ? 0 : -1;
                if (selected && shouldFocus) button.focus();
            });
            renderGrid();
        }

        tabButtons.forEach((button, index) => {
            button.addEventListener("click", () => setActiveTab(button.dataset.kanaTab));
            button.addEventListener("keydown", (event) => {
                if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) {
                    event.preventDefault();
                    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
                    const nextIndex = (index + direction + tabButtons.length) % tabButtons.length;
                    setActiveTab(tabButtons[nextIndex].dataset.kanaTab, true);
                }
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveTab(button.dataset.kanaTab);
                }
            });
        });

        root.querySelectorAll("[data-kana-action]").forEach((button) => {
            button.addEventListener("click", () => {
                const action = button.dataset.kanaAction;
                if (action === "copy") {
                    copyText(output.value).then(() => {
                        flashButton(button);
                        setStatus(uiText("status.copied"));
                    }).catch(() => {
                        setStatus(uiText("status.copyUnsupported"));
                    });
                }
                if (action === "clear") {
                    output.value = "";
                    saveOutput();
                    autoResizeOutput();
                    updateHandoffLinks();
                    output.focus();
                    setStatus(uiText("status.cleared"));
                }
                if (action === "backspace") deleteBeforeCursor();
                if (action === "space") insertText("　");
                if (action === "newline") insertText("\n");
            });
        });

        if (gojuonToggle) {
            gojuonToggle.checked = isGojuonLayout;
            gojuonToggle.addEventListener("change", () => {
                writeStoredString(gojuonLayoutStorageKey, gojuonToggle.checked ? "1" : "0");
                setGojuonLayout(gojuonToggle.checked);
            });
        }
        searchInput.addEventListener("input", renderGrid);
        output.addEventListener("input", () => {
            rememberCaret();
            saveOutput();
            autoResizeOutput();
            updateHandoffLinks();
        });
        output.addEventListener("click", rememberCaret);
        output.addEventListener("keyup", rememberCaret);
        output.addEventListener("select", rememberCaret);
        output.addEventListener("focus", rememberCaret);
        output.addEventListener("blur", rememberCaret);
        if (typeof compactOutputQuery.addEventListener === "function") {
            compactOutputQuery.addEventListener("change", autoResizeOutput);
        } else if (typeof compactOutputQuery.addListener === "function") {
            compactOutputQuery.addListener(autoResizeOutput);
        }

        autoResizeOutput();
        setGojuonLayout(isGojuonLayout, false);
        setActiveTab(activeTab);
        updateHandoffLinks();
    }

    bindClickAll("[data-convert]", (button) => {
        const toolName = button.dataset.convert;
        if (toolName === "era") convertEra();
        else convertTool(toolName);
    });

    bindClickAll("[data-copy]", (button) => copyOutput(button.dataset.copy, button));

    bindClickAll("[data-clear]", (button) => clearTool(button.dataset.clear));

    bindClickAll("[data-era-relative]", (button) => {
        if (!eraElements.input) return;
        const offset = Number(button.dataset.eraRelative || 0);
        const nextDate = offset === 0 ? todayDate() : jumpEraDay(eraElements.input.value, offset);
        eraElements.input.value = formatDateInput(nextDate);
        convertEra();
    });

    bindClickAll("[data-year-jump]", (button) => {
        if (!eraElements.input) return;
        const offset = Number(button.dataset.yearJump || 0);
        eraElements.input.value = formatDateInput(jumpEraYear(eraElements.input.value, offset));
        convertEra();
    });

    bindClickAll("[data-era-date]", (button) => {
        if (!eraElements.input) return;
        eraElements.input.value = button.dataset.eraDate;
        convertEra();
    });

    if (eraElements.input) eraElements.input.addEventListener("input", () => {
        const normalized = normalizeEraDateInput(eraElements.input.value);
        if (eraElements.input.value !== normalized) eraElements.input.value = normalized;
        convertEra();
    });
    [eraElements.gannen, eraElements.korean, eraElements.roman].forEach((option) => {
        if (option) option.addEventListener("change", convertEra);
    });

    applyTransferredText();
    bindLiveTool("width");
    bindLiveTool("kana");
    initKanaPad();
    convertTool("width");
    convertTool("kana");
    convertEra();
    updateHandoffLinks();
}());
