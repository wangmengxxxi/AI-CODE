// script.js
// ====== Data Layer ======
const SAMPLE_PROFILES = [
  {
    id: 1,
    name: "林薇",
    gender: "female",
    age: 28,
    location: "杭州",
    occupation: "UI设计师",
    interests: ["旅行", "阅读", "摄影"],
    bio: "热爱生活细节，相信慢下来的时光最动人。",
    avatarColor: "#a1c4fd"
  },
  {
    id: 2,
    name: "陈哲",
    gender: "male",
    age: 32,
    location: "深圳",
    occupation: "后端工程师",
    interests: ["运动", "音乐", "咖啡"],
    bio: "代码写诗，篮球释压。期待一起探索城市角落。",
    avatarColor: "#c2e9fb"
  },
  {
    id: 3,
    name: "苏瑶",
    gender: "female",
    age: 26,
    location: "成都",
    occupation: "小学教师",
    interests: ["烹饪", "阅读", "园艺"],
    bio: "喜欢教孩子画画，也爱为自己做一顿温暖晚餐。",
    avatarColor: "#fbc2eb"
  },
  {
    id: 4,
    name: "吴磊",
    gender: "male",
    age: 35,
    location: "北京",
    occupation: "创业公司创始人",
    interests: ["旅行", "运动", "音乐"],
    bio: "从硅谷回来，现在做教育科技。相信长期主义。",
    avatarColor: "#84fab0"
  },
  {
    id: 5,
    name: "赵敏",
    gender: "female",
    age: 29,
    location: "上海",
    occupation: "品牌策划",
    interests: ["旅行", "音乐", "烹饪"],
    bio: "策划过30+品牌campaign，私下是厨房实验家。",
    avatarColor: "#a6c1ee"
  },
  {
    id: 6,
    name: "黄宇",
    gender: "male",
    age: 31,
    location: "广州",
    occupation: "医生",
    interests: ["阅读", "运动", "旅行"],
    bio: "三甲医院心内科，周末常在山野徒步。",
    avatarColor: "#ffd166"
  }
];

// ====== State Management ======
const state = {
  filters: {
    gender: "all",
    ageMax: 35,
    selectedTags: new Set()
  },
  likedProfiles: new Set(JSON.parse(localStorage.getItem("likedProfiles") || "[]"))
};

// ====== DOM Elements ======
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const ageRange = document.getElementById("ageRange");
const ageValue = document.getElementById("ageValue");
const genderFilter = document.getElementById("genderFilter");
const tagButtons = document.querySelectorAll(".tag-btn");
const applyFilterBtn = document.getElementById("applyFilter");
const resetFilterBtn = document.getElementById("resetFilter");
const profilesGrid = document.getElementById("profilesGrid");
const noResultsEl = document.getElementById("noResults");

// ====== Utility Functions ======
const renderProfileCard = (profile) => {
  const isLiked = state.likedProfiles.has(profile.id);
  const tagElements = profile.interests.map(tag => 
    `<span class="profile-tag">${tag}</span>`
  ).join("");

  return `
    <article class="profile-card" data-id="${profile.id}">
      <div class="profile-avatar" style="background: linear-gradient(45deg, ${profile.avatarColor}, #ffffff);">
        ${profile.name.charAt(0)}
      </div>
      <div class="profile-info">
        <h3>${profile.name}</h3>
        <div class="meta">
          <span>${profile.age}岁 · ${profile.location}</span>
          <span>${profile.occupation}</span>
        </div>
        <p>${profile.bio}</p>
        <div class="profile-tags">${tagElements}</div>
        <div class="profile-actions">
          <button class="profile-btn btn-like ${isLiked ? 'liked' : ''}" aria-label="${isLiked ? '已心动' : '心动'}">
            ${isLiked ? '❤️ 已心动' : '💓 心动'}
          </button>
          <button class="profile-btn btn-message">💌 发消息</button>
        </div>
      </div>
    </article>
  `;
};

const updateAgeDisplay = () => {
  const minAge = 22;
  const maxAge = parseInt(ageRange.value);
  ageValue.textContent = `${minAge}–${maxAge}岁`;
};

const applyFilters = () => {
  const filtered = SAMPLE_PROFILES.filter(profile => {
    const matchesGender = state.filters.gender === "all" || 
                         (state.filters.gender === "female" && profile.gender === "female") ||
                         (state.filters.gender === "male" && profile.gender === "male");
    
    const matchesAge = profile.age <= state.filters.ageMax && profile.age >= 22;
    
    const matchesTags = state.filters.selectedTags.size === 0 || 
                        Array.from(state.filters.selectedTags).some(tag => 
                          profile.interests.includes(tag)
                        );
    
    return matchesGender && matchesAge && matchesTags;
  });

  // Render results
  if (filtered.length === 0) {
    profilesGrid.innerHTML = "";
    noResultsEl.classList.remove("hidden");
  } else {
    profilesGrid.innerHTML = filtered.map(renderProfileCard).join("");
    noResultsEl.classList.add("hidden");
  }
};

const saveLikesToStorage = () => {
  localStorage.setItem("likedProfiles", JSON.stringify(Array.from(state.likedProfiles)));
};

// ====== Event Listeners ======
filterBtn.addEventListener("click", () => {
  filterPanel.classList.toggle("active");
});

ageRange.addEventListener("input", updateAgeDisplay);

applyFilterBtn.addEventListener("click", () => {
  state.filters.gender = genderFilter.value;
  state.filters.ageMax = parseInt(ageRange.value);
  filterPanel.classList.remove("active");
  applyFilters();
});

resetFilterBtn.addEventListener("click", () => {
  genderFilter.value = "all";
  ageRange.value = "35";
  updateAgeDisplay();
  tagButtons.forEach(btn => btn.classList.remove("active"));
  state.filters.selectedTags.clear();
  filterPanel.classList.remove("active");
  applyFilters();
});

// Tag selection
tagButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;
    if (state.filters.selectedTags.has(tag)) {
      state.filters.selectedTags.delete(tag);
      btn.classList.remove("active");
    } else {
      state.filters.selectedTags.add(tag);
      btn.classList.add("active");
    }
  });
});

// Like button delegation (for dynamic cards)
profilesGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-like")) {
    const card = e.target.closest(".profile-card");
    if (!card) return;
    
    const id = parseInt(card.dataset.id);
    const isLiked = state.likedProfiles.has(id);
    
    if (isLiked) {
      state.likedProfiles.delete(id);
      e.target.textContent = "💓 心动";
      e.target.classList.remove("liked");
    } else {
      state.likedProfiles.add(id);
      e.target.textContent = "❤️ 已心动";
      e.target.classList.add("liked");
    }
    
    saveLikesToStorage();
  }
});

// Message button delegation
profilesGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-message")) {
    const card = e.target.closest(".profile-card");
    if (!card) return;
    const id = parseInt(card.dataset.id);
    const profile = SAMPLE_PROFILES.find(p => p.id === id);
    if (profile) {
      alert(`已向 ${profile.name} 发送消息请求！\n（演示中未连接后端）`);
    }
  }
});

// ====== Initialization ======
document.addEventListener("DOMContentLoaded", () => {
  updateAgeDisplay();
  applyFilters();

  // Add keyboard support for tag buttons
  tagButtons.forEach((btn, i) => {
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
});