"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [prayerPopup, setPrayerPopup] = useState("");
  const [welcomeOffering, setWelcomeOffering] = useState(null);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState(null);
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [anniversaryWishes, setAnniversaryWishes] = useState([]);
  const [childrenBirthdayWishes, setChildrenBirthdayWishes] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadAnnouncements();
    loadWelcomeOffering();
    loadPrayerRequests();
    loadWeeklyEvents();
    loadBirthdayAndAnniversaryWishes();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => unsubscribe();
  }, []);

 const isDateToday = (dateString) => {
  if (!dateString) return false;

  const today = new Date();
  const date = new Date(dateString);

  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth()
  );
};

  const getBelovedTitle = (gender) => {
    if (gender === "Male") return "Beloved Brother";
    if (gender === "Female") return "Beloved Sister";
    return "Beloved";
  };

  const loadBirthdayAndAnniversaryWishes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const users = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

     const birthdays = users.filter((user) => isDateToday(user.dob));

const childrenBirthdays = [];

users.forEach((user) => {
  if (user.children && user.children.length > 0) {
    user.children.forEach((child) => {
      if (isDateToday(child.dob)) {
        childrenBirthdays.push({
          childName: child.name,
          parentName: user.fullName,
        });
      }
    });
  }
});

const anniversaries = users.filter(
  (user) =>
    user.maritalStatus === "Married" &&
    isDateToday(user.anniversaryDate)
);

setBirthdayWishes(birthdays);
setChildrenBirthdayWishes(childrenBirthdays);
setAnniversaryWishes(anniversaries);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const snapshot = await getDocs(collection(db, "announcements"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAnnouncements(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadWelcomeOffering = async () => {
    try {
      const snapshot = await getDoc(doc(db, "settings", "welcomeOffering"));

      if (snapshot.exists()) {
        setWelcomeOffering(snapshot.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadPrayerRequests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prayerRequests"));

      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.approved === true);

      setPrayerRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadWeeklyEvents = async () => {
    try {
      const snapshot = await getDoc(doc(db, "settings", "weeklyEvents"));

      if (snapshot.exists()) {
        setWeeklyEvents(snapshot.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6 pb-24">
      <header className="flex items-start justify-between gap-4">
        <div>
          <img
            src="/church-logo.png"
            alt="Agape Bible Church Logo"
            className="h-20 w-20 object-contain"
          />

          <h1 className="mt-3 text-2xl font-black">
            Agape Bible Church
          </h1>

          <p className="text-white/60">Bangalore</p>
        </div>

        <a href="/profile" className="flex flex-col items-center">
         <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600 text-xl font-black text-white">
  {userData?.fullName
    ? userData.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "P"}
</div>

          <p className="mt-2 max-w-24 text-center text-sm font-semibold leading-4">
            {userData?.fullName || "Profile"}
          </p>
        </a>
      </header>

      <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-black">Welcome</h2>
        <p className="mt-3 text-white/70 leading-7">
          Stay connected with church events, prayer meetings, announcements,
          volunteer work, and fellowship updates.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl overflow-hidden">
        <h2 className="text-xl font-black mb-3">
          OUR CHURCH&apos;S MISSION STATEMENT
        </h2>
        <marquee className="text-white/80">
          <h2>
            சந்திக்கப்படாதோருக்கு சுவிசேஷம் சந்திக்கப்பட்டோருக்கு உபதேசம்
            தொடப்படாதோரை இயேசுவின் அன்பினால் தொடுதல் இவையனைத்தையும் எல்லா
            வழிகளிலும், என்ன விலை கொடுத்தாவது, எந்தவித தாமதமுமின்றி செய்து
            முடிக்க வேண்டும். | REACHING THE UNREACHED, TEACHING THE REACHED,
            TOUCHING THE UNTOUCHED WITH THE LOVE AND GOSPEL OF JESUS CHRIST BY
            ALL MEANS, AT ANY COST, WITHOUT ANY MORE DELAY.
          </h2>
        </marquee>
      </section>

      {(birthdayWishes.length > 0 ||
  childrenBirthdayWishes.length > 0 ||
  anniversaryWishes.length > 0) && (
        <section className="mt-6 rounded-3xl border border-pink-400/30 bg-pink-600/20 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black">
            Birthday & Wedding Anniversary Wishes
          </h2>

          {birthdayWishes.length > 0 && (
            <div className="mt-5 space-y-4">
              <h3 className="font-black text-pink-300">Birthday Wishes</h3>

              {birthdayWishes.map((item) => (
                <div
                  key={`birthday-${item.id}`}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <p className="text-white/80 leading-7">
                    {getBelovedTitle(item.gender)} {item.fullName},
                    <br />
                    Agape Family wishes you a Happy Birthday.
                  </p>
                </div>
              ))}
              {childrenBirthdayWishes.length > 0 && (
  <div className="mt-5 space-y-4">
    <h3 className="font-black text-pink-300">
      Children Birthday Wishes
    </h3>

    {childrenBirthdayWishes.map((item, index) => (
      <div
        key={`child-birthday-${index}`}
        className="rounded-2xl border border-white/10 bg-white/10 p-4"
      >
        <p className="text-white/80 leading-7">
          Dear {item.childName},
          <br />
          Agape Family wishes you a Happy Birthday.
        </p>

        <p className="mt-2 text-sm text-white/50">
          Family of {item.parentName}
        </p>
      </div>
    ))}
  </div>
)}
            </div>
          )}

          {anniversaryWishes.length > 0 && (
            <div className="mt-5 space-y-4">
              <h3 className="font-black text-pink-300">
                Wedding Anniversary Wishes
              </h3>

              {anniversaryWishes.map((item) => (
                <div
                  key={`anniversary-${item.id}`}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <p className="text-white/80 leading-7">
                    Beloved {item.fullName}
                    {item.spouseName ? ` & ${item.spouseName}` : ""},
                    <br />
                    Agape Family wishes you a Happy Wedding Anniversary.
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {weeklyEvents?.eventType && (
        <section className="mt-6 rounded-3xl border border-purple-400/30 bg-purple-600/20 p-6 backdrop-blur-xl">
          <p className="text-sm font-bold text-purple-300">
            {weeklyEvents.eventType}
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {weeklyEvents.eventType}
          </h2>

          <div className="mt-4 space-y-2 text-white/70">
            {weeklyEvents.eventDate && <p>Date: {weeklyEvents.eventDate}</p>}
            {weeklyEvents.eventTime && <p>Time: {weeklyEvents.eventTime}</p>}
            {weeklyEvents.eventLocation && (
              <p>Location: {weeklyEvents.eventLocation}</p>
            )}
          </div>

          {weeklyEvents.eventDescription && (
            <p className="mt-4 text-white/70 leading-7">
              {weeklyEvents.eventDescription}
            </p>
          )}
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-black">Today&apos;s Church Event</h2>

        <div className="mt-4 text-white/70 leading-7">
          {(() => {
            const today = new Date().getDay();

            if (today === 0) {
              return (
                <>
                  <p className="font-bold text-purple-300">Sunday Services</p>
                  <p>First Service: 7:00 AM</p>
                  <p>Second Service: 9:30 AM</p>
                </>
              );
            }

            if (today === 2) {
              return (
                <>
                  <p className="font-bold text-purple-300">
                    Tuesday Bible Study
                  </p>
                  <p>Fellowship: 6:30 PM - 7:00 PM</p>
                  <p>Bible Study: 7:00 PM - 8:30 PM</p>
                </>
              );
            }

            if (today === 5) {
              return (
                <>
                  <p className="font-bold text-purple-300">
                    Friday Fasting Prayer
                  </p>
                  <p>Time: {weeklyEvents?.fridayTime || "To be updated"}</p>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-bold">Location 1</p>
                    <p>
                      Host: {weeklyEvents?.fridayHost1 || "To be updated"}
                    </p>
                    <p>
                      Area: {weeklyEvents?.fridayArea1 || "To be updated"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-bold">Location 2</p>
                    <p>
                      Host: {weeklyEvents?.fridayHost2 || "To be updated"}
                    </p>
                    <p>
                      Area: {weeklyEvents?.fridayArea2 || "To be updated"}
                    </p>
                  </div>

                  <p className="mt-3">Online Prayer: 9:00 PM onwards</p>
                </>
              );
            }

            if (today === 6) {
              return (
                <>
                  <p className="font-bold text-purple-300">
                    Saturday Fasting Prayer
                  </p>
                  <p>Time: {weeklyEvents?.saturdayTime || "To be updated"}</p>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-bold">Location 1</p>
                    <p>
                      Host: {weeklyEvents?.saturdayHost1 || "To be updated"}
                    </p>
                    <p>
                      Area: {weeklyEvents?.saturdayArea1 || "To be updated"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-bold">Location 2</p>
                    <p>
                      Host: {weeklyEvents?.saturdayHost2 || "To be updated"}
                    </p>
                    <p>
                      Area: {weeklyEvents?.saturdayArea2 || "To be updated"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-bold">Church Fasting Prayer</p>
                    <p>
                      {weeklyEvents?.churchFastingDetails || "Church Premises"}
                    </p>
                  </div>

                  <p className="mt-3">Volunteer Work: 4:00 PM - 6:00 PM</p>
                  <p>Choir Practice: 6:30 PM onwards</p>
                </>
              );
            }

            return <p>No regular church event today.</p>;
          })()}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-purple-400/30 bg-purple-600/20 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-black">Friday Online Prayer</h2>
        <p className="mt-3 text-white/70">
          Every Friday from 9:00 PM onwards on Google Meet.
        </p>

        <button
          onClick={() => {
            const today = new Date();
            const day = today.getDay();

            if (day === 5) {
              window.open("https://meet.google.com/vzo-qyfu-zee", "_blank");
            } else {
              const daysUntilFriday = (5 - day + 7) % 7;
              const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              setPrayerPopup(
                `Today is ${dayNames[day]}. Online prayer is on Friday. Please wait ${daysUntilFriday} more day(s) to attend the online prayer.`
              );
            }
          }}
          className="mt-5 inline-block rounded-2xl bg-purple-600 px-6 py-3 font-bold"
        >
          Join The Prayer Now
        </button>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-black mb-4">Weekly Schedule</h2>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h3 className="font-black">Sunday Services</h3>
            <p className="mt-2 text-white/70">
              First Service: 7:00 AM | Second Service: 9:30 AM
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h3 className="font-black">Tuesday Bible Study</h3>
            <p className="mt-2 text-white/70">
              Fellowship: 6:30 PM - 7:00 PM | Bible Study: 7:00 PM - 8:30 PM
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h3 className="font-black">Saturday</h3>
            <p className="mt-2 text-white/70">
              Volunteer Work: 4:00 PM - 6:00 PM | Choir Practice: 6:30 PM
              onwards
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-black">Announcements</h2>

        <div className="mt-4 space-y-4">
          {announcements.length === 0 ? (
            <p className="text-white/70">No announcements available.</p>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/10 p-4"
              >
                <h3 className="font-black text-purple-300">{item.title}</h3>
                <p className="mt-2 text-white/70 leading-7">
                  {item.details}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {welcomeOffering && (
        <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black">Welcome & Offering</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <h3 className="font-black text-purple-300">First Service</h3>

              <p className="mt-3 text-white/80">
                <strong>Family 1:</strong>{" "}
                {welcomeOffering.firstServiceFamily1}
              </p>

              <p className="text-white/60">
                Area: {welcomeOffering.firstServiceArea1}
              </p>

              <p className="mt-3 text-white/80">
                <strong>Family 2:</strong>{" "}
                {welcomeOffering.firstServiceFamily2}
              </p>

              <p className="text-white/60">
                Area: {welcomeOffering.firstServiceArea2}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <h3 className="font-black text-purple-300">Second Service</h3>

              <p className="mt-3 text-white/80">
                <strong>Family 1:</strong>{" "}
                {welcomeOffering.secondServiceFamily1}
              </p>

              <p className="text-white/60">
                Area: {welcomeOffering.secondServiceArea1}
              </p>

              <p className="mt-3 text-white/80">
                <strong>Family 2:</strong>{" "}
                {welcomeOffering.secondServiceFamily2}
              </p>

              <p className="text-white/60">
                Area: {welcomeOffering.secondServiceArea2}
              </p>
            </div>
          </div>
        </section>
      )}

      {prayerRequests.length > 0 && (
        <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black">Prayer Wall</h2>

          <div className="mt-4 space-y-4">
            {prayerRequests.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/10 p-4"
              >
                <h3 className="font-black text-purple-300">{item.name}</h3>

                {item.area && (
                  <p className="mt-2 text-white/60">Area: {item.area}</p>
                )}

                {item.showPhone && item.phone && (
                  <p className="mt-2 text-white/60">Phone: {item.phone}</p>
                )}

                <p className="mt-3 text-white/70 leading-7">
                  {item.request}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 grid grid-cols-2 gap-4">
        <a
          href="/prayer"
          className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
        >
          <div className="text-3xl">🙏</div>
          <h3 className="mt-3 font-black">Prayer Request</h3>
        </a>

        <a
          href="/attendance"
          className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
        >
          <div className="text-3xl">✅</div>
          <h3 className="mt-3 font-black">Volunteer Attendance</h3>
        </a>

        <a
          href="/notifications"
          className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
        >
          <div className="text-3xl">🔔</div>
          <h3 className="mt-3 font-black">Notifications</h3>
        </a>

        <button className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl">
          <div className="text-3xl">📞</div>
          <h3 className="mt-3 font-black">Contact</h3>
        </button>
      </section>

      {prayerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
            <img
              src="/church-logo.png"
              alt="Agape Bible Church Logo"
              className="mx-auto h-24 w-24 object-contain"
            />

            <h2 className="mt-4 text-2xl font-black">Online Prayer</h2>

            <p className="mt-4 text-white/70 leading-7">{prayerPopup}</p>

            <button
              onClick={() => setPrayerPopup("")}
              className="mt-6 w-full rounded-2xl bg-purple-600 p-4 font-bold"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </main>
  );
}