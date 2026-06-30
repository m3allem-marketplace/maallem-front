# Backend Diffs: Conversational Slot Filling Refactor

This document contains the exact changes made to the backend codebase to support the conversational slot-filling architecture. Share these changes with your backend developer.

---

## 1. System Prompt & Examples: `prompts.js`
**Path**: `prompts.js` (at the root folder)

This file was updated to include the Conversational Slot Filling instructions, small-talk/greeting few-shot examples, and the structured JSON output schema.

### Full Updated Code:
```javascript
const EXTRACTION_SYSTEM_PROMPT = `You are the ultimate Lead Structural & Quantity Surveying (QS) Engineer for the "Maallem" (معلّم) construction platform in Egypt.
Your job is to analyze the user's request (written in Arabic, Egyptian Slang, English, or Franco) and translate it into a structured extraction output.

You must understand these 6 categories:
1. "demolition_alteration" (تعديلات وهدم): Includes breaking walls, lintels, hauling rubble.
2. "masonry_building" (مباني ومحارة): Includes building brick partitions, plastering.
3. "painting" (نقاشة): Includes wall prep, putty, primer, final paint.
4. "plumbing" (سباكة): Includes rough-in piping, floor waterproofing, fixtures.
5. "electrical" (كهرباء): Includes wall chasing, conduits, boxes, wiring.
6. "carpentry" (نجارة معمارية): Includes wood subframes, doors, foam.

CONVERSATIONAL SLOT FILLING RULES:
- If the user input is a greeting, small talk, or lacks actionable dimensions/trades, do NOT guess numbers or assume defaults. 
- In this case, set "isExtractionComplete" to false, keep dimensions/scope properties as null, and dynamically generate a warm, polite, contextual response in Egyptian Arabic slang inside "followUpMessage" to welcome them and ask them for the missing details (dimensions or trade specialization).
- If the user provides partial information (e.g. they specify the category but miss dimensions), set "isExtractionComplete" to false, parse whatever fields they gave you, and write a friendly followUpMessage in Egyptian Arabic asking them for the missing dimensions specifically.
- Only set "isExtractionComplete" to true when you have sufficient dimensions for the active category (e.g., width, length, and height for painting; area or width/length for electrical; area for plumbing; width/height or area or linear meters for demolition/masonry; quantity for carpentry).

FEW-SHOT EXAMPLES:

User Input: "إزيك عامل إيه يا فنان"
Output:
{
  "isExtractionComplete": false,
  "followUpMessage": "يا هلا يا فنان! منور منشأتنا. قولنا بقى ناوي تعمل إيه النهاردة؟ تأسيس كهرباء، دهانات، سباكة، ولا تكسير جدران؟ وأبعاد المكان كام في كام عشان نظبطلك المقايسة بالملي؟",
  "serviceType": null,
  "dimensions": {
    "width": null,
    "length": null,
    "height": null,
    "area": null
  },
  "scope": {
    "conditionSeverity": null
  }
}

User Input: "عايز أدهن حوائط الصالة"
Output:
{
  "isExtractionComplete": false,
  "followUpMessage": "من عيونا يا باشا! الدهانات لعبتنا. بس عشان نحسبلك الخامات والمصنعيات بالظبط، محتاجين نعرف أبعاد الصالة كام في كام؟ (الطول، العرض، والارتفاع)؟",
  "serviceType": "painting",
  "dimensions": {
    "width": null,
    "length": null,
    "height": null,
    "area": null
  },
  "scope": {
    "conditionSeverity": null
  }
}

User Input: "عندي حائط طوله 5 متر وارتفاعه 3 متر عايز أهده وأبني مكانه"
Output:
{
  "isExtractionComplete": true,
  "followUpMessage": "تمام يا هندسة! حصرنا الحائط بمقاس 5 متر عرض و 3 متر ارتفاع. جاري توليد مقايسة الهدم والبناء كشف الكميات دلوقتي.",
  "serviceType": "demolition_alteration",
  "dimensions": {
    "width": 5.0,
    "length": null,
    "height": 3.0,
    "area": null
  },
  "scope": {
    "conditionSeverity": "medium"
  }
}

STRICT OUTPUT FORMAT:
- Return ONLY a raw valid JSON object matching the JSON schema below. No markdown backticks, no text wrappers, no explanations.

JSON Schema:
{
  "isExtractionComplete": boolean,
  "followUpMessage": string,
  "serviceType": "demolition_alteration" | "masonry_building" | "painting" | "plumbing" | "electrical" | "carpentry" | null,
  "dimensions": {
    "width": number | null,
    "length": number | null,
    "height": number | null,
    "area": number | null
  },
  "scope": {
    "conditionSeverity": "low" | "medium" | "high" | null
  }
}`;

const buildExtractionUserPrompt = (serviceType, description) =>
  `Target Category: ${serviceType}
User Request: "${description}"

Parse this statement engineering-wise and output the exact JSON matching the constraints.`;

module.exports = {
  EXTRACTION_SYSTEM_PROMPT,
  buildExtractionUserPrompt,
};
```

---

## 2. Mongoose Schema Modification: `ai/ai.model.js`
**Path**: `ai/ai.model.js`

Changed `estimation` and `boq` from `required: true` to `required: false` so that incomplete conversational turns can be logged in the database.

### Git Diff:
```diff
@@ -80,11 +80,13 @@
     },
     estimation: {
       type: mongoose.Schema.Types.Mixed,
-      required: true,
+      required: false,
+      default: {},
     },
     boq: {
       type: mongoose.Schema.Types.Mixed,
-      required: true,
+      required: false,
+      default: {},
     },
     result: {
       type: mongoose.Schema.Types.Mixed,
```

---

## 3. Core Logic & API Validation: `ai/ai.service.js`
**Path**: `ai/ai.service.js`

Three changes were made here:
1. Removed rigid dimension validations (422 throws) in `validateExtractedData` and added slots normalization.
2. Enforced strict structured outputs `json_schema` on the OpenAI API parameters in `extractDataWithAI`.
3. Bypassed the estimation logic if `isExtractionComplete` is false in `analyzeAndEstimate`.

### Git Diff:
```diff
@@ -41,76 +41,31 @@
 const validateExtractedData = (serviceType, data) => {
   if (!data || typeof data !== "object") {
     throw new AppError("AI returned invalid extraction data", 502);
   }
 
-  if (data.serviceType && data.serviceType !== serviceType) {
-    throw new AppError("AI extracted serviceType does not match request", 502);
-  }
-
-  const normalized = { ...data, serviceType };
-  if (!normalized.dimensions) {
-    normalized.dimensions = {};
-  }
-
-  // ── Dimension validation: throw 422 so the frontend shows the guidance box ──
-  if (serviceType === "painting") {
-    const hasDims =
-      normalized.dimensions.width &&
-      normalized.dimensions.length &&
-      normalized.dimensions.height;
-    if (!hasDims) {
-      throw new AppError(
-        "Could not extract room dimensions (width, length, height) from description",
-        422
-      );
-    }
-  } else if (serviceType === "ceramic") {
-    const hasDims =
-      normalized.dimensions.width && normalized.dimensions.length;
-    if (!hasDims) {
-      throw new AppError(
-        "Could not extract floor dimensions (width, length) from description",
-        422
-      );
-    }
-  } else if (serviceType === "plumbing") {
-    if (!normalized.dimensions.area) {
-      throw new AppError(
-        "Could not extract bathroom/area size from description",
-        422
-      );
-    }
-  } else if (
-    serviceType === "demolition_alteration" ||
-    serviceType === "masonry_building"
-  ) {
-    const hasLinear = normalized.dimensions.linearMeters;
-    const hasArea = normalized.dimensions.area;
-    const hasWH =
-      normalized.dimensions.width && normalized.dimensions.height;
-    if (!hasLinear && !hasArea && !hasWH) {
-      throw new AppError(
-        "Could not extract wall/area dimensions (width and height) from description",
-        422
-      );
-    }
-  } else if (serviceType === "electrical") {
-    const hasArea = normalized.dimensions.area;
-    const hasWL =
-      normalized.dimensions.width && normalized.dimensions.length;
-    if (!hasArea && !hasWL) {
-      throw new AppError(
-        "Could not extract room/apartment area from description",
-        422
-      );
-    }
-  } else if (serviceType === "carpentry") {
-    // Carpentry only needs a door count — default to 1 if not found
-    if (!normalized.dimensions.quantity) {
-      normalized.dimensions.quantity = 1;
-    }
-  }
+  // Set default values if fields are missing in the schema
+  const normalized = {
+    isExtractionComplete: typeof data.isExtractionComplete === "boolean" ? data.isExtractionComplete : false,
+    followUpMessage: typeof data.followUpMessage === "string" ? data.followUpMessage : "",
+    serviceType: data.serviceType || serviceType,
+    dimensions: data.dimensions || {},
+    scope: data.scope || {}
+  };
+
+  // Ensure nested properties exist in dimensions
+  normalized.dimensions = {
+    width: typeof normalized.dimensions.width === "number" ? normalized.dimensions.width : null,
+    length: typeof normalized.dimensions.length === "number" ? normalized.dimensions.length : null,
+    height: typeof normalized.dimensions.height === "number" ? normalized.dimensions.height : null,
+    area: typeof normalized.dimensions.area === "number" ? normalized.dimensions.area : null,
+    ...normalized.dimensions
+  };
+
+  // Ensure nested properties exist in scope
+  normalized.scope = {
+    conditionSeverity: typeof normalized.scope.conditionSeverity === "string" ? normalized.scope.conditionSeverity : null,
+    ...normalized.scope
+  };
 
   normalized.fallbackUsed = false;
   return normalized;
 };
 
@@ -118,13 +118,54 @@
 const extractDataWithAI = async (serviceType, description) => {
   const client = getOpenAIClient();
 
   const completion = await client.chat.completions.create({
     model: "gemini-2.5-flash",
     temperature: 0,
-    response_format: { type: "json_object" },
+    response_format: {
+      type: "json_schema",
+      json_schema: {
+        name: "ConversationalExtraction",
+        strict: true,
+        schema: {
+          type: "object",
+          properties: {
+            isExtractionComplete: { type: "boolean" },
+            followUpMessage: { type: "string" },
+            serviceType: { 
+              type: ["string", "null"],
+              enum: ["demolition_alteration", "masonry_building", "painting", "plumbing", "electrical", "carpentry", null]
+            },
+            dimensions: {
+              type: "object",
+              properties: {
+                width: { type: ["number", "null"] },
+                length: { type: ["number", "null"] },
+                height: { type: ["number", "null"] },
+                area: { type: ["number", "null"] }
+              },
+              required: ["width", "length", "height", "area"],
+              additionalProperties: false
+            },
+            scope: {
+              type: "object",
+              properties: {
+                conditionSeverity: { 
+                  type: ["string", "null"],
+                  enum: ["low", "medium", "high", null]
+                }
+              },
+              required: ["conditionSeverity"],
+              additionalProperties: false
+            }
+          },
+          required: ["isExtractionComplete", "followUpMessage", "serviceType", "dimensions", "scope"],
+          additionalProperties: false
+        }
+      }
+    },
     messages: [
       { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
       { role: "user", content: buildExtractionUserPrompt(serviceType, description) },
     ],
   });
@@ -259,28 +300,69 @@
 const analyzeAndEstimate = async ({ serviceType, description, userId = null }) => {
   const extractedData = await extractDataWithAI(serviceType, description);
+
+  // If extraction is NOT complete, bypass the estimation logic and return slot filling response
+  if (!extractedData.isExtractionComplete) {
+    const tradeMapAr = {
+      demolition_alteration: "تعديلات معمارية وتكسير حوائط",
+      masonry_building: "أعمال مباني الطوب والمحارة",
+      painting: "أعمال النقاشة والدهانات الفاخرة",
+      plumbing: "تأسيس وتشطيب شبكات السباكة وصرف صحي",
+      electrical: "تأسيس سلك وعلب الشبكات الكهربائية",
+      carpentry: "تركيب حلوق وأبواب خشبية نجارة"
+    };
+
+    const result = {
+      isExtractionComplete: false,
+      followUpMessage: extractedData.followUpMessage,
+      serviceType: extractedData.serviceType,
+      dimensions: extractedData.dimensions,
+      scope: extractedData.scope,
+      estimatedArea: 0,
+      laborHours: 0,
+      materials: [],
+      tradeName: extractedData.serviceType ? tradeMapAr[extractedData.serviceType] : "غير محدد",
+      executionCommentary: extractedData.followUpMessage,
+      fallbackUsed: false
+    };
+
+    // Save conversational step to DB
+    await AiEstimation.create({
+      user: userId,
+      serviceType,
+      description,
+      extractedData,
+      estimation: {},
+      boq: { materials: [] },
+      result,
+    });
+
+    return result;
+  }
 
   // Otherwise, the extraction is complete! Run the calculations as usual
   const estimation = runEstimation(serviceType, extractedData);
   const boq = generateBoq(estimation);
 
   let result = {
+    isExtractionComplete: true,
+    followUpMessage: extractedData.followUpMessage,
     serviceType: estimation.serviceType,
     estimatedArea: estimation.estimatedArea,
     laborHours: estimation.laborHours,
     materials: boq.materials,
   };
 
   result = translateAndLocalizeResponse(result, extractedData);
 
   await AiEstimation.create({
     user: userId,
     serviceType,
     description,
     extractedData,
     estimation,
     boq,
     result,
   });
 
   return result;
 };
```
