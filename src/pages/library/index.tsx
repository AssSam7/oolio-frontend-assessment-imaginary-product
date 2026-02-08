import { useMemo, useState } from "react";
import Icon from "@/components/common/Icon";

import {
  getCurrentDate,
  getTomorrowDate,
  getFutureDate,
  isLeapYear,
  getCurrentYear,
  parsePhone,
  chunkArray,
  getUnique,
  sortByProperty,
  groupByProperty,
  Note,
  BigNote,
} from "@aslam-dev/my-lib";

const LibraryPage = () => {
  const [phoneInput, setPhoneInput] = useState("+1 (555) 123-4567");
  const [phoneValidation, setPhoneValidation] = useState<ReturnType<
    typeof parsePhone
  > | null>(null);

  /* ---------------- Date Examples ---------------- */

  const currentDate = getCurrentDate();
  const tomorrowDate = getTomorrowDate();
  const futureDate = getFutureDate(30);
  const leapYear = isLeapYear();
  const currentYear = getCurrentYear();

  /* ---------------- Transformers ---------------- */

  const sampleArray = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);
  const duplicateArray = useMemo(() => [1, 2, 2, 3, 3, 4, 5, 5], []);

  const users = useMemo(
    () => [
      { name: "Alice", age: 30, role: "admin" },
      { name: "Bob", age: 25, role: "user" },
      { name: "Charlie", age: 35, role: "admin" },
      { name: "David", age: 28, role: "user" },
    ],
    []
  );

  const chunkedArray = useMemo(() => chunkArray(sampleArray, 3), [sampleArray]);
  const uniqueArray = useMemo(
    () => getUnique(duplicateArray),
    [duplicateArray]
  );
  const sortedUsers = useMemo(
    () => sortByProperty(users, "age", "desc"),
    [users]
  );
  const groupedByRole = useMemo(() => groupByProperty(users, "role"), [users]);

  /* ---------------- Handlers ---------------- */

  const handlePhoneValidation = () => {
    setPhoneValidation(parsePhone(phoneInput, "US"));
  };

  return (
    <div className="min-h-screen">
      <main className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Icon
                  name="AlertTriangleIcon"
                  size={24}
                  className="w-6 h-6 text-red-500"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Library Showcase
                </h1>
                <p className="text-muted-foreground">
                  Demonstrating reusable utilities & UI components
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- Date Utilities ---------------- */}

          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Icon name="Calendar" className="w-5 h-5" />
              Date Utilities
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Current Date:</strong> {currentDate}
              </p>
              <p>
                <strong>Tomorrow:</strong> {tomorrowDate}
              </p>
              <p>
                <strong>30 Days from Now:</strong> {futureDate}
              </p>
              <p>
                <strong>Is {currentYear} Leap Year?</strong>{" "}
                {leapYear ? "Yes ✓" : "No ✗"}
              </p>
            </div>
          </section>

          {/* ---------------- Phone Validation ---------------- */}

          <section className="bg-card p-6 rounded-lg border border-border mt-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Icon name="Phone" className="w-5 h-5" />
              Phone Validation
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />

              <button
                onClick={handlePhoneValidation}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Validate
              </button>
            </div>

            {phoneValidation && (
              <div
                className={`rounded-lg border p-4 transition-all ${
                  phoneValidation.isValid
                    ? "border-success/30 bg-success/10"
                    : "border-error/30 bg-error/10"
                }`}
              >
                {/* Status Row */}
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    name={
                      phoneValidation.isValid ? "CheckCircle2" : "AlertCircle"
                    }
                    size={18}
                    color={
                      phoneValidation.isValid
                        ? "var(--color-success)"
                        : "var(--color-error)"
                    }
                  />

                  <span className="font-medium text-foreground">
                    {phoneValidation.isValid
                      ? "Valid phone number"
                      : "Invalid phone number"}
                  </span>
                </div>

                {/* Success Details */}
                {phoneValidation.isValid && !("error" in phoneValidation) && (
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <strong>International:</strong>{" "}
                      {phoneValidation.international}
                    </p>
                    <p>
                      <strong>National:</strong> {phoneValidation.national}
                    </p>
                    <p>
                      <strong>Country:</strong> {phoneValidation.country}
                    </p>
                    <p>
                      <strong>Type:</strong> {phoneValidation.type}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {"error" in phoneValidation && (
                  <p className="text-sm text-error">{phoneValidation.error}</p>
                )}
              </div>
            )}
          </section>

          {/* ---------------- Transformers ---------------- */}

          <section className="bg-card p-6 rounded-lg border border-border mt-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Icon name="ListFilter" className="w-5 h-5" />
              Transformers
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Chunked:</p>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {JSON.stringify(chunkedArray)}
                </code>
              </div>

              <div>
                <p className="font-medium">Unique:</p>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {JSON.stringify(uniqueArray)}
                </code>
              </div>

              <div>
                <p className="font-medium">Sorted Users:</p>
                <div className="bg-muted p-2 rounded text-xs">
                  {sortedUsers.map((u) => (
                    <div key={u.name}>
                      {u.name} - {u.age} - {u.role}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium">Grouped By Role:</p>
                <div className="bg-muted p-2 rounded text-xs">
                  {Object.entries(groupedByRole).map(([role, users]) => (
                    <div key={role}>
                      <strong>{role}:</strong>{" "}
                      {users.map((u) => u.name).join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- UI Components ---------------- */}

          <section className="space-y-4 mt-8">
            <Note
              title="Reminder"
              content="Don't forget to review the project proposal today!"
            />

            <BigNote
              title="Description"
              // content="Reusable large note component from npm library."
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
