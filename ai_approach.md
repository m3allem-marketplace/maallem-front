# Maallem AI Architecture: Q-Scale (BOQ) & Worker Recommendations

This document outlines the design principles, architectures, workflows, and core differences between the two AI-driven systems powering the **Maallem Platform**:
1. **Q-Scale (BOQ) AI**: A hybrid conversational estimation assistant.
2. **Worker Recommendations AI**: An NLP-driven search and matching coordinator.

---

## 🗺️ High-Level Architectural Map

```mermaid
graph TD
    User([User Input Prompt]) --> ModeCheck{Platform Mode Selected}

    %% Q-Scale Path
    ModeCheck -- Q-Scale (BOQ) --v SlotFill[1. Conversational Slot Filling (Gemini 2.5 Flash)]
    SlotFill --> ExtCheck{Extraction Complete?}
    ExtCheck -- No --> FormHelp[Show In-App Form & Follow-up Prompt]
    FormHelp --> User
    ExtCheck -- Yes --> EstEngine[2. Deterministic Estimation Engine (Civil Formulas)]
    EstEngine --> BOQEngine[3. BOQ & Localization Engine (SKUs & Slang)]
    BOQEngine --> DeliverBOQ([Deliver Live BOQ & Materials List])

    %% Recommendations Path
    ModeCheck -- Worker Recommendations --v NLPAnalyze[1. Intent & Location Extraction (GPT-4o-Mini)]
    NLPAnalyze --> DBQuery[2. Mongoose Worker Query (Specialization + Regex City)]
    DBQuery --> WorkerCheck{Workers Found in City?}
    WorkerCheck -- Yes --> DeliverRecs([Deliver Top 10 Worker Profiles])
    WorkerCheck -- No --> FallbackSearch[3. Fallback Query (Specialization Only)]
    FallbackSearch --> DeliverRecs
```

---

## 1. Worker Recommendations AI Approach

The **Worker Recommendations AI** is designed to parse informal, unstructured descriptions of problems (e.g., *"عندي ماسورة مكسورة وبتسرب مية في حدائق الأهرام"*) and instantly return verified workers who specialize in the required trade and are located in the user's city.

### The Backend Matching Pipeline (`ai_recommendations.service.js`)

1. **Intent & Location Extraction**:
   - The backend passes the user's description (story) to `gpt-4o-mini`.
   - The model is instructed to output a structured JSON response identifying the trade classification, the location, and a friendly Egyptian Arabic greeting.
   - **Trade Schema Constraint**: The extracted service type MUST match one of our 6 core trades:
     `"demolition_alteration" | "masonry_building" | "painting" | "plumbing" | "electrical" | "carpentry"`.

2. **Mongoose Database Querying**:
   - The system queries the `WorkerProfile` collection using:
     - `specializations`: Matches the AI-extracted `serviceType`.
     - `location.city`: Matches the AI-extracted `city` using a case-insensitive regex pattern (`$regex`).
   - The user reference is populated to fetch details like name, email, and phone.

3. **Fallback Resiliency**:
   - > [!IMPORTANT]
     > To prevent empty result screens when no workers are registered in a newly specified or niche city, the query automatically falls back. If the initial query returns 0 matches, the system drops the city filter and queries solely by the specialization, ensuring the user always receives recommendations.

---

## 2. Q-Scale (BOQ) AI Approach

The **Q-Scale AI** uses a hybrid **Extraction-Calculation Paradigm** to solve the problem of direct LLM mathematical calculations, which are highly prone to hallucination and pricing inaccuracies.

### The Hybrid Pipeline (`ai.service.js` & `estimation.service.js`)

1. **Conversational Slot Filling (Gemini 2.5 Flash)**:
   - Instead of doing math, the LLM reads natural Arabic or English prompts and populates a strict JSON schema.
   - Its primary role is to extract numerical dimensions (`width`, `length`, `height`, `area`) and scope factors (`conditionSeverity`, `floorLevel`), and check if it has enough parameters (`isExtractionComplete: true/false`).

2. **Intake & Dialog Loop**:
   - If information is missing (`isExtractionComplete: false`), the backend returns a friendly slang response (`followUpMessage`).
   - **UI Integration**: The Angular frontend intercepts this state and displays a tailored input form (e.g., dimensions sliders/fields). When submitted, these details are appended back into the description.

3. **Deterministic Estimation Engine**:
   - Once all inputs are extracted, the backend executes precise civil engineering formulas matching local Egyptian construction standards.
   - *Example (Painting)*:
     $$\text{Wall Area} = 2 \times \text{Height} \times (\text{Length} + \text{Width})$$
     $$\text{Total Painting Area} = \text{Wall Area} + (\text{Length} \times \text{Width}) \text{ [Ceiling]}$$

4. **BOQ SKU Mapping & Localizer**:
   - Maps calculated numbers to standard SKUs (e.g., `PAINT001` for acrylic paint, `PUTTY001` for wall putty) and returns local Egyptian descriptions, hauling details, and total pricing.

---

## 3. Core Differences: Q-Scale vs. Recommendations

| Feature / Aspect | Q-Scale (BOQ) AI | Worker Recommendations AI |
| :--- | :--- | :--- |
| **Primary Goal** | Estimate material quantities, costs, and labor hours. | Match a user's service request to registered workers. |
| **Processing Paradigm** | **Extraction + Math**: LLM extracts slots; code calculates. | **NLP Extraction + DB Query**: LLM classifies; DB filters. |
| **Target Output** | Structured Bill of Quantities (materials, units, hours). | List of suitable worker profile objects from the database. |
| **Required Inputs** | Physical dimensions (length, width, height, etc.). | Problem description AND location/city. |
| **Model Used** | `gemini-2.5-flash` (Structured Outputs Schema) | `gemini-2.5-flash` (Structured Outputs Schema) |
| **Fallback System** | Pops open an interactive UI form to gather missing fields. | Conversational slot-filling (asks for missing trade or city) + global specialization search if city has no registered workers. |

---

## ⚙️ Technical Blueprint: File Responsibilities

* **`ai_recommendations.service.js`**: Orchestrates `gemini-2.5-flash` intent classification and performs Mongoose `WorkerProfile` queries with regex location lookups.
* **`ai.service.js`**: Drives the Gemini slot-filling parsing, coordinates database logging, and maps the localized Egyptian Arabic commentary.
* **`estimation.service.js`**: Houses the deterministic math functions and standard material density coefficients (cement bag counts per cubic meter, waste factor rates, etc.).
* **`boq.service.js`**: Translates materials volume and requirements to platform SKUs and calculates price estimates.
