"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Carousel, Column, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./WorkCarousel.module.scss";
import { workProjects, WorkProject } from "@/resources/portfolio-data";

function BilingualBlock({ vi, en, mutedEN }: { vi: string; en: string; mutedEN?: boolean }) {
  return (
    <div className="pnt-bilingual">
      <span className="pnt-vi">{vi}</span>
      <span className={mutedEN ? "pnt-en pnt-muted" : "pnt-en"}>{en}</span>
    </div>
  );
}

function classShort(value: string) {
  const parts = value.split(":");
  const last = (parts[parts.length - 1] ?? value).trim();
  return last || value;
}

function ClassBadge({ value }: { value: string }) {
  const short = classShort(value);
  return (
    <div className={styles.classBadge} aria-label={`Construction Class ${short}`}>
      <span className={styles.classBadgeLabel}>Construction Class:</span>
      <span className={styles.classBadgeValue}>{short}</span>
      <span className={styles.shimmer} aria-hidden="true" />
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: WorkProject; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose} role="presentation">
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <Heading as="h2" variant="heading-strong-l" wrap="balance">
              <BilingualBlock vi={project.titleVI} en={project.titleEN} />
            </Heading>
          </div>

          <div className={styles.modalHeaderRight}>
            <ClassBadge value={project.constructionClassEN} />
            <button className={styles.closeIconBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <Carousel
            sizes="(max-width: 960px) 100vw, 960px"
            items={project.images.map((src, idx) => ({
              slide: src,
              alt: `${project.titleEN} – ${idx + 1}`,
            }))}
          />

          <div className={styles.section}>
            <Heading as="h3" variant="heading-strong-m">
              <BilingualBlock vi="Tổng quan" en="Overview" />
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              <BilingualBlock vi={project.details.overviewVI} en={project.details.overviewEN} />
            </Text>
          </div>

          <div className={styles.section}>
            <Heading as="h3" variant="heading-strong-m">
              <BilingualBlock vi="Nhiệm vụ chính" en="Key responsibilities" />
            </Heading>
            <div className={styles.list}>
              {project.details.responsibilitiesVI.map((vi, idx) => (
                <div key={idx}>
                  <BilingualBlock vi={vi} en={project.details.responsibilitiesEN[idx] ?? ""} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkCarousel() {
  const n = workProjects.length;
  const hasLoop = n > 1;

  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Virtual list for seamless looping: [last, ...real, first]
  const projects = useMemo(() => {
    if (!hasLoop) return workProjects;
    return [workProjects[n - 1], ...workProjects, workProjects[0]];
  }, [hasLoop, n]);

  // Virtual index (includes clones). Start at 1 (first real item).
  const [activeV, setActiveV] = useState(hasLoop ? 1 : 0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  // Drag / swipe
  const [dragPx, setDragPx] = useState(0);
  const dragState = useRef<{ id: number | null; startX: number; lastX: number; dragging: boolean }>(
    { id: null, startX: 0, lastX: 0, dragging: false },
  );
  const suppressClickUntil = useRef(0);

  const toRealIndex = (vIdx: number) => {
    if (!hasLoop) return vIdx;
    if (vIdx === 0) return n - 1;
    if (vIdx === n + 1) return 0;
    return vIdx - 1;
  };

  const activeIndex = toRealIndex(activeV);
  const activeProject = workProjects[activeIndex];

  const openProject = useMemo(
    () => workProjects.find((p) => p.id === openId) ?? null,
    [openId],
  );

  const go = (dir: 1 | -1) => {
    if (!hasLoop) {
      setActiveV((v) => Math.max(0, Math.min(n - 1, v + dir)));
      return;
    }
    setTransitionOn(true);
    setActiveV((v) => v + dir);
  };

  const goToReal = (idx: number) => {
    if (idx < 0 || idx > n - 1) return;

    setTransitionOn(true);
    if (!hasLoop) {
      setActiveV(idx);
      return;
    }

    // Real index i maps to virtual index i + 1 ([last, ...real, first])
    setActiveV(idx + 1);
  };

  // When reaching clone edges, jump (without transition) back to the real item after the slide animation finishes.
  const onTrackTransitionEnd = () => {
    if (!hasLoop) return;

    if (activeV === 0) {
      setTransitionOn(false);
      setActiveV(n);
      requestAnimationFrame(() => setTransitionOn(true));
      return;
    }

    if (activeV === n + 1) {
      setTransitionOn(false);
      setActiveV(1);
      requestAnimationFrame(() => setTransitionOn(true));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoop, n, activeV]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!hasLoop) return;
    // Only primary button (mouse) or touch/pen.
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = viewportRef.current;
    if (!el) return;

    dragState.current = {
      id: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      dragging: false,
    };
    el.setPointerCapture(e.pointerId);
    setTransitionOn(false);
    setDragPx(0);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const st = dragState.current;
    if (st.id !== e.pointerId) return;
    const dx = e.clientX - st.startX;
    st.lastX = e.clientX;
    if (Math.abs(dx) > 6) st.dragging = true;
    setDragPx(dx);
  };

  const onPointerUpOrCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const st = dragState.current;
    if (st.id !== e.pointerId) return;

    const el = viewportRef.current;
    try {
      el?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const width = el?.clientWidth ?? 1;
    const dx = dragPx;
    const ratio = Math.abs(dx) / width;
    const shouldSwipe = ratio > 0.12 || Math.abs(dx) > 60;

    setTransitionOn(true);
    setDragPx(0);

    if (st.dragging) suppressClickUntil.current = Date.now() + 250;

    dragState.current = { id: null, startX: 0, lastX: 0, dragging: false };

    if (!shouldSwipe) return;
    // Swiping left means going to next item.
    if (dx < 0) go(1);
    else go(-1);
  };

  return (
    <Column fillWidth gap="m" paddingX="l" paddingTop="24" paddingBottom="40">
      <Row fillWidth paddingLeft="12">
        <Heading as="h2" variant="heading-strong-l" wrap="balance">
          <span className="pnt-vi">Dự án</span>
          <br />
          <span className="pnt-en">Projects</span>
        </Heading>
      </Row>

      <div className={styles.featuredWrap}>
        <div
          ref={viewportRef}
          className={styles.featuredViewport}
          aria-roledescription="carousel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
        >
          <div
            className={styles.featuredTrack}
            style={{
              transform: `translateX(calc(-${activeV * 100}% + ${dragPx}px))`,
              transition: transitionOn ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {projects.map((project, idx) => (
              <div className={styles.featuredSlide} key={`${project.id}-${idx}`}>
                <button
                  className={styles.featuredButton}
                  onClick={() => {
                    if (Date.now() < suppressClickUntil.current) return;
                    setOpenId(project.id);
                  }}
                  aria-label={`Open ${project.titleEN}`}
                >
                  <div className={styles.featuredCover}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.cover} alt={project.titleEN} loading="lazy" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.progressRow} aria-label="Project index" role="tablist">
        {workProjects.map((p, i) => (
          <button
            key={p.id}
            className={i === activeIndex ? styles.progressDotActive : styles.progressDot}
            onClick={() => goToReal(i)}
            aria-label={`Go to ${p.titleEN}`}
            aria-current={i === activeIndex}
            role="tab"
            type="button"
          />
        ))}
      </div>

      <div className={styles.summaryBar} aria-live="polite" key={activeProject.id}>
        <div className={styles.summaryLeft}>
          <div className={styles.projectName}>
            <span className="pnt-vi">{activeProject.titleVI}</span>
            <span className="pnt-en">{activeProject.titleEN}</span>
          </div>
          <div className={styles.projectLocation}>{activeProject.locationEN}</div>
        </div>

        <div className={styles.summaryRight}>
          <div className={styles.projectRole}>
            <div className={styles.projectRoleVI}>
              <span className="pnt-vi">{activeProject.primaryRoleVI}</span>
            </div>
            <div className={styles.projectRoleEN}>
              <span className="pnt-en">{activeProject.primaryRoleEN}</span>
            </div>
          </div>
        </div>
      </div>

      {openProject ? <ProjectModal project={openProject} onClose={() => setOpenId(null)} /> : null}
    </Column>
  );
}
