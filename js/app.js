// ============================================
// Binary lesson - interactive demos + quiz
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  setupBinaryDemo("binaryDemo", "demoBinary", "demoDenary", null, "resetDemo");
  setupBinaryDemo("convertDemo", "convertBinary", "convertDenary", "convertWorking", "resetConvert");
  setupQuiz();
});

// --------------------------------------------
// Interactive bit demo
// --------------------------------------------
function setupBinaryDemo(containerId, binaryOutId, denaryOutId, workingId, resetId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cells = container.querySelectorAll(".bit-cell");
  const binaryOut = document.getElementById(binaryOutId);
  const denaryOut = document.getElementById(denaryOutId);
  const workingOut = workingId ? document.getElementById(workingId) : null;

  const update = () => {
    let binary = "";
    let total = 0;
    const onParts = [];
    cells.forEach(cell => {
      const value = parseInt(cell.dataset.value, 10);
      const isOn = cell.classList.contains("on");
      const bit = isOn ? "1" : "0";
      cell.querySelector(".bit").textContent = bit;
      binary += bit;
      if (isOn) {
        total += value;
        onParts.push(value);
      }
    });
    binaryOut.textContent = binary;
    denaryOut.textContent = total;
    if (workingOut) {
      workingOut.textContent = onParts.length === 0
        ? "Click bits to add up the values"
        : onParts.join(" + ") + " = " + total;
    }
  };

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("on");
      update();
    });
  });

  const resetBtn = document.getElementById(resetId);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      cells.forEach(c => c.classList.remove("on"));
      update();
    });
  }
}

// --------------------------------------------
// Quiz / test
// --------------------------------------------
function setupQuiz() {
  const checkBtn = document.getElementById("checkBtn");
  const resetBtn = document.getElementById("resetQuiz");
  const scoreBox = document.getElementById("scoreBox");
  const scoreNum = document.getElementById("scoreNum");
  const scoreMsg = document.getElementById("scoreMessage");

  if (!checkBtn) return;

  // Live feedback as students type
  document.querySelectorAll(".quiz-input").forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("correct", "wrong");
    });
  });

  checkBtn.addEventListener("click", () => {
    let score = 0;
    let total = 0;

    // Text input questions
    document.querySelectorAll(".quiz-input").forEach(input => {
      total++;
      const expected = input.dataset.answer.trim();
      const type = input.dataset.type;
      let given = input.value.trim();

      if (type === "binary") {
        // accept with or without leading zeros, allow spaces
        given = given.replace(/\s+/g, "");
        // pad to 8 bits if shorter
        if (/^[01]+$/.test(given)) {
          given = given.padStart(8, "0");
        }
      }

      const correct = given === expected;
      input.classList.remove("correct", "wrong");
      input.classList.add(correct ? "correct" : "wrong");
      if (correct) score++;
    });

    // Multiple choice
    document.querySelectorAll(".q.mcq").forEach(q => {
      total++;
      const expected = q.dataset.answer;
      const checked = q.querySelector("input[type=radio]:checked");
      q.classList.remove("correct", "wrong");
      if (checked && checked.value === expected) {
        q.classList.add("correct");
        score++;
      } else {
        q.classList.add("wrong");
      }
    });

    scoreBox.classList.remove("hidden");
    scoreNum.textContent = score;

    let msg = "";
    if (score === total) msg = "Amazing! Full marks! \u{1F389}";
    else if (score >= 8) msg = "Great work! Almost there.";
    else if (score >= 5) msg = "Good effort - have another try at the red ones.";
    else msg = "Don't worry - watch the video again and try once more.";
    scoreMsg.textContent = msg;

    scoreBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  resetBtn.addEventListener("click", () => {
    document.querySelectorAll(".quiz-input").forEach(i => {
      i.value = "";
      i.classList.remove("correct", "wrong");
    });
    document.querySelectorAll(".q.mcq").forEach(q => {
      q.classList.remove("correct", "wrong");
      q.querySelectorAll("input[type=radio]").forEach(r => (r.checked = false));
    });
    scoreBox.classList.add("hidden");
  });
}
